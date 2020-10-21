import React, { useState, useEffect, Fragment } from "react"
import {
	ActivityIndicator,
	StyleSheet,
	View,
	Text,
	TouchableNativeFeedback,
	SafeAreaView,
	FlatList,
	Alert,
	Button,
	Redirect } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
	VictoryTooltip,
	VictoryChart,
	VictoryTheme,
	VictoryAxis,
	VictoryCandlestick,
	VictoryLine,
	VictoryCursorContainer,
	VictoryZoomContainer,
	VictoryVoronoiContainer,
 	createContainer} from "victory-native";


function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        time;

    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min;
    return time;
}

function convertTimeInDay(timestamp){
	var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds z
			hh = d.getHours(),
			h = hh,
			min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
			time;

	time = h + ':' + min;
	return time;

}

function setRange(){
	var now = new Date();
	var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var timestamp = startOfDay / 1000;
	var	startTime = Math.round(timestamp) + 34200; //startTime: 9:30am of the day
	var closeTime = Math.round(timestamp) + 57600;
	var	endTime = Math.round(now.getTime() / 1000); //endTime: Now

	if( now / 1000 < startTime && now.getDay() == 1 ){
			startTime = Math.round(timestamp) + 34200 - 86400 * 3;
			endTime = Math.round(timestamp) + 57600 - 86400 * 3;
			closeTime = Math.round(timestamp) + 57600 - 86400 * 3;
	}
	else if( now / 1000 < startTime ) {
		startTime = Math.round(timestamp) + 34200 - 86400;
		endTime = Math.round(timestamp) + 57600 -  86400;
		closeTime = Math.round(timestamp) + 57600 - 86400;
	}
	if(now.getDay() == 0){
		startTime = Math.round(timestamp) + 34200 - 86400 * 2;
		endTime = Math.round(timestamp) + 57600 - 86400 * 2;
		closeTime = Math.round(timestamp) + 57600 - 86400 * 2;
	}
	if (endTime > closeTime){
		endTime = closeTime;
	}
	return { startTime, closeTime, endTime };
}


class DetailScreen extends React.Component {
	constructor(props){
		super(props);
    this.onActivated = this.updatePoint.bind(this);
		this.state = {
			symbol : this.props.route.params.symbol,
			info : [{ x:1, y:1 }, { x:2, y:2 }],
			isLoading : true,
			point : {},
			currPrice : 0,
			timestamp : 0,
			timeInDay : 0,
			yMin : 0,
			yMax : 0
		}
	}

	componentDidMount() {
		var { startTime, closeTime, endTime } = setRange();
		var myUrl = 'https://finnhub.io/api/v1/stock/candle?symbol=' + this.state.symbol + '&resolution=5&from=' + startTime + '&to=' + closeTime + '&token=btnth1n48v6p0j27i8k0';
		new Promise((resolve, reject) =>{
			fetch(myUrl)
				.then((response) => response.json())
				.then((data) => {
								const dataLength = data["c"].length;
								var dataArray = [];

								this.setState({ yMin : data["c"][0], yMax: data["c"][0]});

								//All the elements
								for(var i = 0; i < dataLength; i++){
									const curVal = data["c"][i];
									const curTime = data["t"][i];
									if(curVal < this.state.yMin){
										this.setState({ yMin : curVal });
									}
									else if(curVal > this.state.yMax){
										this.setState({ yMax : curVal });
									}
									var pt = {};
									pt["x"] = curTime;
									pt["y"] = curVal;
									dataArray.push(pt);
								}

								// for(var curTimestamp = startTime; curTimestamp < closeTime; curTimestamp += 300){
								// 	const curPosition = data.findIndex((element) => element.x === curTimestamp);
								// 	Alert.alert(curPosition);
								// 	while(curPosition == -1){
								// 		curTimestamp -= 300;
								// 		curPosition = data.findIndex((element) => element.x === curTimestamp);
								// 	}
								// 	const curVal = data["c"][curPosition];
								// 	if(curVal < this.state.yMin){
								// 		this.setState({ yMin : curVal });
								// 	}
								// 	else if(curVal > this.state.yMax){
								// 		this.setState({ yMax : curVal });
								// 	}
								// 	var pt = {};
								// 	pt["x"] = curTimestamp;
								// 	pt["y"] = curVal;
								// 	dataArray.push(pt);
								// }

								this.setState({ yMax : this.state.yMax + 0.1 * (this.state.yMax-this.state.yMin), yMin : this.state.yMin - 0.1 * (this.state.yMax-this.state.yMin)});
								this.setState({ info: dataArray, currPrice: dataArray[dataLength-1].y });
				})
				.catch((error) => {
					reject(new Error('Network Failure'));
				})
	      .finally(() => {
	        this.setState({ isLoading: false });
	      });
			});
		}


	  updatePoint(points) {
	    this.setState({ point: points[0] });
			this.setState({ currPrice: points[0].y });
			this.setState({ timestamp: points[0].x });
			this.setState({ timeInDay: convertTimeInDay(points[0].x) })
	  }




	render(){
		const VictoryCursorVoronoiContainer = createContainer("cursor", "voronoi");
		const {
			symbol,
		  info,
			isLoading,
			currPrice,
			yMin,
			yMax,
			timeInDay
		} = this.state;
		const { startTime, closeTime, endTime } = setRange();

	// const Item = ({ title }) => (
  // 	<View style={styles.item}>
  //   	<Text>{title}</Text>
  // 	</View>
	// );

	//Buttons

	// const onPress = (msg) => {
	// 	setResolution(msg)
	// 	alert(resolution)
	// };

	// const renderItem = ({ item }) => (
	// 	<TouchableNativeFeedback
	// 			onPress={
	// 				() => onPress(item.id)
	// 			}
	// 			background={TouchableNativeFeedback.SelectableBackground()}>
	// 		<View style={{width: 50, height: 50, marginHorizontal : 5, backgroundColor: '#86C166'}}>
	// 			<Text>{item.title}</Text>
	// 		</View>
	//
	// 	</TouchableNativeFeedback>
	// );


	// const buttons = [
	//   {
	//     id: '30',
	//     title: '1W',
	//   },
	//   {
	//     id: 'D',
	//     title: '1M',
	//   },
	//   {
	//     id: 'W',
	//     title: '1Y',
	//   },
	// ];
	//
	// function updatePrice(datum){
	// 	setCurrPrice(info[info.findIndex(element => element.x === datum.x)].y);
	// }


  return (
		<View style={styles.container}>
			<View style={styles.leftContainer}>
      	<Text
					style={styles.gainStockSymbol}
					>
					{symbol}
					</Text>
				<Text
					style={styles.gainStockSymbol}
					>
					${currPrice}
					</Text>
				<Text>
				at {timeInDay}
				 </Text>
			</View>
			{isLoading ? <ActivityIndicator/> : (
				<VictoryChart
					padding={{ top: 50, bottom: 50, left: 0, right: 0 }}
					domain={{ x : [startTime, closeTime], y: [ yMin, yMax ] }}
					containerComponent={
					<VictoryVoronoiContainer
						voronoiDimension="x"
						onActivated={this.onActivated}
						labelComponent={<VictoryTooltip/>}
						/>
					}
				>
				<VictoryAxis style={{
					axis: {stroke: "transparent"},
					ticks: {stroke: "transparent"},
					tickLabels: { fill:"transparent"}
				}} />
  			<VictoryLine
					padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
    			style={{
      		data: { stroke: "#0aa344" }
					}}
    			data = {info}
  			/>
				<VictoryLine
					padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
					data = {[
						{ x : this.state.timestamp, y : yMin },
						{ x : this.state.timestamp, y : yMax }
					]}
				/>
				</VictoryChart>
			)}
    </View>

  );
}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		padding: 25,
	},
	symbolText: {
		marginVertical : 12,
		textAlign: "center",
		fontSize: 21,
	},
	leftContainer: {
		flex: 0,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginRight: 'auto'
	},
	gainStockSymbol:{
		textAlign: "left",
		color: "#000000",
		fontSize: 36
	}

});


export default DetailScreen;

// import * as React from 'react';
// import {
//   Text,
//   View,
//   Button } from 'react-native';
// import { Ionicons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
//
// class PortfolioDetailScreen extends React.Component {
// 	render(){
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Details!</Text>
//     </View>
//   );
// }
// }
// export default PortfolioDetailScreen;
