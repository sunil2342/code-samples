import React, { Component } from 'react';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import {AsyncStorage, View, StyleSheet, Image, KeyboardAvoidingView, Alert, ScrollView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Footer, FooterTab, Button, Left, Right, Icon, Item, Content, Card, CardItem, Input, Text, Body, List, ListItem, Radio, CheckBox} from 'native-base';
//Import Global Styles
import { Fonts } from '../../utils/Fonts';
export class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Username: '',
      Password: '',
    };
  }
  _onSelect = ( item ) => {
        console.log(item);
      };
      // custm header styles
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t('login:title'),
    headerStyle: {
      backgroundColor: '#302f2f',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize:15,
      fontFamily:Fonts.Cairo,
    },
  });
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('UserName', 'I like to save it.');
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('UserName');
      if (value !== null) {
        // We have data!!
        Alert.alert('Message', value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _removeData = async () => {
    try {
      const value = await AsyncStorage.removeItem('UserName');
      Alert.alert('Message', JSON.stringify(value));
      if (value !== null) {

        // We have data!!
        Alert.alert('Message', JSON.stringify(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  render() {
    var styles = require('./styles/en/Login.js');
    if( i18next.language === 'ar') var styles = require('./styles/ar/Login.js');
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    return (
      <Container>
        <Content>
          <View style={{  flex:1,
            justifyContent: 'center',
            alignItems: 'center', top:40,zIndex: 2}}>
            <Image
                source={require('../../images/customer/customer-icon.png')}
            /></View>
          <Card style={styles.containerStyle} >
          <CardItem style={{ marginTop:40 }}>
          <Body>
          <Item
            regular
            style={{ backgroundColor: 'white', marginVertical: 10 }}>
            <Icon style={styles.iconSpec} active name='md-call' />
            <Input style={styles.inputSpec} placeholder={t('common:mobile')} keyboardType={'number-pad'} />
          </Item>
          <Item
            regular
            style={{ backgroundColor: 'white', marginVertical: 10 }}>
            <Icon style={styles.iconSpec} active name='md-lock' />
            <Input
             style={styles.inputSpec}
              placeholder={t('common:password')}
              secureTextEntry={true}
              onChangeText={text => this.setState({ Password: text })}
              value={this.state.Password}
            />
            <Right>
            <TouchableOpacity>
            <Icon style={{fontSize:14, marginRight:12,color:"#cccccc",}} active name='eye-off' />
            </TouchableOpacity>
            </Right>
          </Item>
          <View style={styles.marginSpecAll}>
          <Button
            block
            style={styles.btnStyle}
            onPress={() => navigate('Dashboard')}>
            <Text style={styles.btnStyle}>{t('common:login').toUpperCase()}</Text>
          </Button>
          </View>
           <View style={styles.Row}>
            <View style={styles.deviderLeft}/>
            <View style={styles.aligned}>
            <Text style={styles.LoginVia}>{t('login_via_social')}</Text>
            </View>
        <View style={styles.deviderRight}/>
      </View>
      <View style={styles.RowSpec}>
      <View style={{width: "33.33%",}}/>
      <View style={{width: "33.33%",justifyContent: 'center',alignItems: 'center',}}>
      <TouchableOpacity>
      <Image style={styles.logo} source={require('../../images/customer/google-plus.png')}/>
      </TouchableOpacity>
      </View>
      <View style={{width: "33.33%",}}/>
      </View>
          </Body>
          </CardItem>
            <CardItem footer>
            </CardItem>
         </Card>
         <View style={styles.account}>
         <View><Text style={{color: "#7f7f7f",fontFamily:Fonts.Cairo}}>{t('dont_have_account')}</Text></View>
         <TouchableOpacity onPress={() => navigate('SignUp')}>
         <Text style={{color: "#ff6600",fontFamily:Fonts.Cairo}}> {t('common:signup')} </Text>
         </TouchableOpacity>
         </View>
        </Content>
      </Container>
    );
  }
}
export default translate(['login', 'common'], { wait: true })(Login);
