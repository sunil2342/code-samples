import * as React from 'react';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
//import { Constants } from 'expo';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Item,
  Input,
} from 'native-base';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createMaterialBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';


import Dashboard from './Dashboard/Dashboard';
import Profile from './Dashboard/Profile';
import Settings from './Dashboard/Settings';



const MyTabNavigation = createMaterialTopTabNavigator(
  {
    Dashboard: Dashboard,
    Profile: Profile,
    Settings: Settings,
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontWeight: 'bold',
      },
      style: {
        backgroundColor: '#333333',
      },
    },
  }
);

export default createDrawerNavigator(
  {
    Home: {
      screen: MyTabNavigation,
      navigationOptions: {
        drawerIcon: <Icon name="md-home" size={25} />,
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        drawerIcon: <Icon name="md-contact" size={25} />,
      },
    },
    Setting: {
      screen: Settings,
      navigationOptions: {
        drawerIcon: <Icon name="md-settings" size={25} />,
      },
    },
    About: {
      screen: Settings,
      navigationOptions: {
        drawerIcon: <Icon name="md-albums" size={25} />,
      },
    },
    Contact: {
      screen: Settings,
      navigationOptions: {
        drawerIcon: <Icon name="md-call" size={25} />,
      },
    },
    Logout: {
      screen: Settings,
      navigationOptions: {
        drawerIcon: <Icon name="md-key" size={25} />,
      },
    },
  },
  {
    initialRouteName: 'Profile',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
  
);
