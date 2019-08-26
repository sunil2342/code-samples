import React, { Component } from 'react';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import {I18nManager} from 'react-native';
import PropTypes from 'prop-types';
import RNRestart from 'react-native-restart';
import { redux } from 'redux';
import { connect } from 'react-redux';
import {View, StyleSheet, Image, KeyboardAvoidingView, Alert, ScrollView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Footer, FooterTab, Button, Left, Right, Icon, Item, Content, Card, CardItem, Input, Text, Body, List, ListItem, Radio, CheckBox} from 'native-base';
var styles = require('./styles/en/Language.js');
import { Fonts } from '../../utils/Fonts';

export class Language extends React.Component {
  constructor(props) {
   super(props);
   I18nManager.forceRTL(false);
 }

 LanguageSetAR = () =>
  {
     const { t, i18n, navigation } = this.props;
     i18n.changeLanguage('ar');
     I18nManager.forceRTL(true);
    // RNRestart.Restart();
     this.props.navigation.navigate('Type');
  }
  LanguageSetEN = () =>
   {
      const { t, i18n, navigation } = this.props;
      i18n.changeLanguage('en');
      this.props.navigation.navigate('Type');
      I18nManager.forceRTL(false);
  //    RNRestart.Restart();
   }
 //hide react navigation
 static navigationOptions = ({ navigation }) => ({
  header: null,
 });
  render() {
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    return (
      <Container>
       <ImageBackground source={require('../../images/language/language-type.png')} style={styles.MainContainer}>
       <Content>
       <View style={{  flex:1,
         justifyContent: 'center',
         alignItems: 'center', top:70,zIndex: 2, marginBottom:25}}>
         <Image
           source={require('../../images/language/khabeer-icon-home.png')}
         />
       </View>
         <View style={{  flex:1,
           justifyContent: 'center',
           alignItems: 'center', top:45,zIndex: 2}}>
           <Image
               source={require('../../images/language/khabeer-icon.png')}
           /></View>
         <Card style={styles.containerStyle} >
         <CardItem>
         <Body>
         <View style={styles.language}>
         <View><Text style={{color: "#7f7f7f",fontFamily:Fonts.Cairo}}>SELECT YOUR LANGUAGE</Text></View>
         </View>
     <View style={styles.RowSpec}>
     <View style={{width: "50%",justifyContent: 'center',alignItems: 'center',}}>
     <TouchableOpacity onPress = { this.LanguageSetEN }>
     <Image style={styles.logo} source={require('../../images/language/en-language.png')}/>
     </TouchableOpacity>
     <Text onPress = { this.LanguageSetEN } style={{color: "#7f7f7f",marginTop:11,fontFamily:Fonts.Cairo}}>ENGLISH</Text>
     </View>
     <View style={{width: "50%",justifyContent: 'center',alignItems: 'center',}}>
     <TouchableOpacity onPress = { this.LanguageSetAR }>
     <Image style={styles.logo} source={require('../../images/language/ar-language.png')}/>
     </TouchableOpacity>
     <Text onPress = { this.LanguageSetAR } style={{color: "#7f7f7f", fontSize:18,fontFamily:Fonts.Cairo}}>عربي</Text>
     </View>
        </View>
         </Body>
         </CardItem>
           <CardItem footer>
           </CardItem>
        </Card>
       </Content>
      </ImageBackground>
     </Container>
    );
  }
}
export default translate(['language', 'common'], { wait: true })(Language);
