import React, { Component } from 'react';
import { translate } from 'react-i18next';
import {StatusBar, View, StyleSheet, Image, KeyboardAvoidingView, Alert, ScrollView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Footer, FooterTab, Button, Left, Right, Icon, Item, Content, Card, CardItem, Input, Text, Body, List, ListItem, Radio, CheckBox} from 'native-base';
var styles = require('./styles/en/Type.js');
import { Fonts } from '../../utils/Fonts';

export class Type extends React.Component {
  //hide react navigation
  static navigationOptions = ({ navigation }) => ({
   header: null,
   gesturesEnabled: false,
  });
  render() {
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    return (
      <Container>
      <StatusBar
backgroundColor="#000000"
barStyle="light-content"
translucent={true}
/>
       <ImageBackground source={require('../../images/user-type/user-type.png')} style={styles.MainContainer}>
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
         <View><Text style={{color: "#7f7f7f",fontFamily:Fonts.Cairo}}>{t('type').toUpperCase()}</Text></View>
         </View>
     <View style={styles.RowSpec}>
     <View style={{width: "50%",justifyContent: 'center',alignItems: 'center',}}>
     <TouchableOpacity onPress={() => navigate('Login')}>
     <Image style={styles.logo} source={require('../../images/user-type/customer-type.png')}/>
     </TouchableOpacity>
     <Text onPress={() => navigate('Login')} style={{color: "#7f7f7f",marginTop:11,fontFamily:Fonts.Cairo}}>{t('common:customer').toUpperCase()}</Text>
     </View>
     <View style={{width: "50%",justifyContent: 'center',alignItems: 'center',}}>
     <TouchableOpacity onPress={() => navigate('TechLogin')}>
     <Image style={styles.logo} source={require('../../images/user-type/technician-type.png')}/>
     </TouchableOpacity>
     <Text style={{color: "#7f7f7f",marginTop:11,fontFamily:Fonts.Cairo}} onPress={() => navigate('TechLogin')}>{t('common:technician').toUpperCase()}</Text>
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
export default translate(['type', 'common'], { wait: true })(Type);
