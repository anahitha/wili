import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BorrowScreen from './screens/Borrow';
import SearchScreen from './screens/SearchScreen';

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const TabNavigator = createBottomTabNavigator({
  Borrow : { screen: BorrowScreen },
  Search: { screen: SearchScreen }
}, 
{
  defaultNavigationOptions: ({navigation})=>({
    tabBarIcon: ()=>{
      const RouteName = navigation.state.routeName;
      if (RouteName=="Borrow"){
        return(
          <Image source= {require("./assets/book.png")}
          style = {{
            width: 40,
            height:40
          }}></Image>
        )
      }
      else if (RouteName=="Search"){
        return(
          <Image source= {require("./assets/searchingbook.png")}
          style = {{
            width: 40,
            height:40
          }}></Image>
        )
      }
    }
  })
});


const AppContainer = createAppContainer(TabNavigator);