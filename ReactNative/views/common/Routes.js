import React, { Component } from "react";
import i18next from 'i18next';
import {View, TouchableOpacity, AsyncStorage, I18nManager} from 'react-native';
import {Container, Header, Title, Footer, FooterTab, Button, Left, Right, Icon, Item, Content, Card, CardItem, Input, Text, Body, List, ListItem, Radio, CheckBox} from 'native-base';
import {StackNavigator,createBottomTabNavigator,createMaterialTopTabNavigator,createStackNavigator,DrawerNavigator,createMaterialBottomTabNavigator,createDrawerNavigator,
} from 'react-navigation';
//Import Global Styles
import { Fonts } from '../../utils/Fonts';
// our content pages
import Language from './Language';
import TermsConditions from './TermsConditions';
import Type from './Type';
import Login from '../customer/Login';
import Dashboard from '../customer/profile/Dashboard';
import SubMenu from '../customer/profile/SubMenu';
import SignUp from '../customer/SignUp';
import TechLogin from '../technician/TechLogin';
import TechSignUp from '../technician/TechSignUp';
// the navigation stack
const Routes = StackNavigator(
  {
  Language: { screen: Language},
  Type: { screen: Type },
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  TechLogin: { screen: TechLogin },
  TechSignUp: { screen: TechSignUp },
  TermsConditions: { screen: TermsConditions },
  Dashboard: {
   screen: Dashboard,
   navigationOptions : ({ navigation }) => ({
   title: 'PROFILE',
   gesturesEnabled: false,
   headerStyle: {
     backgroundColor: '#302f2f',
   },
   headerTintColor: '#fff',
   headerTitleStyle: {
     fontWeight: '500',
     fontSize:15,
     fontFamily:Fonts.Cairo,
   },
   headerLeft: (
     <TouchableOpacity
       onPress={() => navigation.openDrawer()}
       style={{ padding: 5 }}>
       <Icon  style={{color:"#ffffff", marginLeft:5}} name="md-menu" size={25} />
     </TouchableOpacity>
   ),
   headerRight: (
     <View style={{ flexDirection: 'row' }}>
       <TouchableOpacity
         onPress={ ()=> { } }
         style={{ padding: 5 }}>
         <Icon style={{color:"#ffffff", marginRight:5}} name="md-create" size={25} />
       </TouchableOpacity>
     </View>
   ),
   })
 },
 Submenu: {
   screen: SubMenu,
 }
});
export default Routes;
