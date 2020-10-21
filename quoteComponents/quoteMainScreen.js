import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Button, StyleSheet, Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

function MainScreen(){
  const [isLoading, setLoading] = useState(true);
  const [symbols, setSymbols] = useState([]);
  const [prices, setPrices] = useState([]);
  //const [counter, setCounter] = useState([1,2,3,4,5,6,7,8]);

  useEffect(() => {
    fetch('https://finnhub.io/api/v1/stock/peers?symbol=TSLA&token=bti23hf48v6uv69liml0')
    .then(response => response.json())
    .then(data => {
        console.log("old", data);
        return data;
    })
    .then(async data => {//getQuote-esque
        await Promise.all(data.map((symbol, index, array) => {
            return fetch('https://finnhub.io/api/v1/quote?symbol='+ symbol +'&token=bti23hf48v6uv69liml0')
                .then(response => response.json())
                .then(data => {
                    array[index] = {symbol, ...data};
                })
        }));
        console.log("new", data)
        setPrices(data);
    });
    setLoading(false);
},[]);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator /> : (
        <View>
          <Text style = {styles.header}>
            Stocks
          </Text>
          <FlatList
            data = {prices}
            keyExtractor = {(item) => item.symbol}
            renderItem = {({ item }) =>(

              <View style = {styles.main}>
                <Text style = {styles.stockText}>
                  {item.symbol}                                                ${item.c}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#AAA',
    padding: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    width: windowWidth - 20,
    height: 40,
    marginLeft: 10,
    backgroundColor: '#AFC',
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 30,
  }, header: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 10
  },
  stockText: {
    fontWeight: '600',
    marginLeft: 5,
    marginTop: 8
  },
});

export default MainScreen
