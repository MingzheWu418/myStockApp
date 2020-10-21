// API ATTEMPT
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, FlatList, Dimensions,TouchableWithoutFeedback, Linking} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default class MainScreen extends React.Component{

    state = {
      loading: true,
      news: null,
    }

    async componentDidMount() {
        const url = "https://finnhub.io/api/v1/news?category=general&token=bti23hf48v6uv69liml0";
        //Current parameters
          //country: US
          //Category: business, technology, topheadlines
        const response = await fetch(url);
        const fData = await response.json();

        this.setState( { news: fData, loading: false} )
        console.log(fData);
    }

    render(){
        console.log("Working!");

        if( this.state.loading ) {
              return (
                  <View style = {styl.loadingScreen}>
                      <ActivityIndicator/>
                  </View>
              )
        } else {
              console.log(this.state.news[0]);
              return(
                  <View>
                      <View >
                          <Text style = {styl.header1}>Stock Market News</Text>
                      </View>

                      <View style = {{backgroundColor: '#9FE2BF'}}>
                          <FlatList
                            data = {this.state.news}
                            renderItem = { ({item}) =>{
                              return(
                                  <TouchableWithoutFeedback  onPress = {() => Linking.openURL(item.url)}>
                                      <View style = {styl.main}>

                                          <Image fadeDuration = {1000} source = {{uri: item.image}}
                                                 style = { styl.Imager}/>

                                           <View style = {styl.shader}>
                                              <Text style = {{color: '#fff', fontWeight: 'bold', position: 'absolute', fontSize: 18, marginLeft: 5, textAlign: 'center' }}> {item.headline} </Text>
                                           </View>

                                      </View>
                                  </TouchableWithoutFeedback>
                              );
                            }}
                          />
                          <View style = {{paddingBottom: 0}} />
                      </View>
                  </View>
              )
        }
    }
}

const styl = StyleSheet.create({
    container: {
      flex: 1,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#9FE2BF',

    }, shader: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,.45)',
      borderRadius: 15,

    }, loadingScreen: {
      color: 'blue',
      justifyContent: 'center',
      alignItems: 'center'

    }, header1: {
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 25,
      backgroundColor: '#9FE2BF',

    }, main: {
      width: windowWidth - 20,
      height: 150,
      marginLeft: 10,
      backgroundColor: '#9FE2BF',
      marginBottom: 15,

    }, Imager: {
      ...StyleSheet.absoluteFill,
        borderRadius: 15,
    }
});
