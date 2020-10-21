import React, { useState, useEffect, Fragment } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableNativeFeedback,
	SafeAreaView,
	FlatList,
	Alert,
	Button,
	Redirect } from "react-native"


function displayStock() {
	const [stock, setStock] = useState(null);
  const indexArray = [];
  indexArray.length = 10;

	useEffect(() => {
		updateStock();
		return () => {
		}
	}, []);

	function updateStock(){
	  return new Promise((resolve, reject) =>{
	    fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=btnth1n48v6p0j27i8k0')
			.then((response)=>response.json())
			.then((data) => {
        for(var i = 0; i < 10; i++){
				      const randomIndex = Math.floor(Math.random() * data.length);
              indexArray[i] = data[randomIndex];
        }
        setStock(indexArray);
			}).catch((error) => {
	      reject(new Error('Network Failure'));
	    }).done();
	  });
	}

	return { stock, updateStock };
}


function PortfolioMainScreen({ navigation }) {
	const { stock, updateStock } = displayStock();
	const renderItem = ({ item }) => (
		<TouchableNativeFeedback
				onPress={() => { navigation.navigate('Detail', {
            symbol: item.symbol,
          });
				}}
        background={TouchableNativeFeedback.SelectableBackground()}>
      <View style={{width: 300, height: 50, marginVertical : 5, backgroundColor: '#86C166'}}>
        <Text style={styles.symbolText}>{item.symbol}</Text>
      </View>

    </TouchableNativeFeedback>
	);

	return (
		<SafeAreaView style={styles.container}>
			{
				<Fragment>
					<FlatList
						data = {stock}
						renderItem = {renderItem}
						keyExtractor = {item => item.displaySymbol}
						/>
					<Button
						onPress = {updateStock}
						title = "Show Me Some Other Stocks!"
						color = '#DB8E71'
						/>

				</Fragment>
			}
		</SafeAreaView>
	);
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
		color: "#000",
		fontSize: 36
	}

});


export default PortfolioMainScreen;
