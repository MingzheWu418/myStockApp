// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import {
  Text,
  View,
  Button } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PortfolioMainScreen from './portfolioComponents/PortfolioMainScreen';
import PortfolioDetailScreen from './portfolioComponents/PortfolioDetailScreen';
import NewsMainScreen from './newsComponents/NewsMainScreen';
import QuoteMainScreen from './quoteComponents/quoteMainScreen';
const PortfolioStack = createStackNavigator();

function PortfolioScreen() {
  return (
      <PortfolioStack.Navigator>
        <PortfolioStack.Screen
          name="Portfolio"
          component={PortfolioMainScreen}
          />
        <PortfolioStack.Screen
          name="Detail"
          component={PortfolioDetailScreen}
          />
      </PortfolioStack.Navigator>
  );
}


function QuoteScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName = {"Portfolio"}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Portfolio') {
              iconName = focused ? 'folder-open' : 'folder';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'News') {
              iconName = focused ? 'mailbox-open' : 'mailbox';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Quote'){
              iconName = focused ? 'ios-trending-up' : 'ios-trending-up';
            }

            // You can return any component that you like here!

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="News" component={NewsMainScreen} />
        <Tab.Screen name="Portfolio" component={PortfolioScreen} />
        <Tab.Screen name="Quote" component={QuoteMainScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
