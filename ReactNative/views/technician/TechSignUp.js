import React, { Component } from 'react';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import {View, StyleSheet, Image, KeyboardAvoidingView, Alert, ScrollView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Footer, FooterTab, Button, Left, Right, Icon, Item, Content, Card, CardItem, Input, Text, Body, List, ListItem, Radio, CheckBox} from 'native-base';
import { Fonts } from '../../utils/Fonts';
import RadioForm from 'react-native-radio-form';
export class TechSignUp extends React.Component {
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
    title: screenProps.t('techsignup:title'),
    headerBackTitle: null,
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
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    const isIos = Platform.OS === 'ios'
    const SPACER_SIZE = 1000; //arbitrary size
    const TOP_COLOR = '#ffffff';
    const BOTTOM_COLOR = '#ffffff';
    const Gender = [{ label: t('common:male'), value: 'Male'},{ label: t('common:female'), value: 'Female'}];
    var styles = require('./styles/en/SignUp.js');
    if( i18next.language === 'ar') var styles = require('./styles/ar/SignUp.js');
    return (
      <ScrollView
     style={{backgroundColor: isIos ? BOTTOM_COLOR : TOP_COLOR }}
     contentContainerStyle={{backgroundColor: TOP_COLOR}}
     contentInset={{top: -SPACER_SIZE}}
     contentOffset={{y: SPACER_SIZE}}>
     {isIos && <View style={{height: SPACER_SIZE}} />}
      <Container>
        <Content>
          <View style={{  flex:1,
            justifyContent: 'center',
            alignItems: 'center', top:40,zIndex: 2}}>
            <Image
                source={require('../../images/technician/technician-type-space.png')}
            /></View>
          <Card style={styles.containerStyle} >
          <CardItem style={{ marginTop:40 }}>
          <Body>
          <Item
            regular
            style={{ backgroundColor: 'white', marginVertical: 10}}>
            <Icon style={styles.iconSpec} active name='person' />
            <Input
            style={styles.inputSpec}
              placeholder= {t('common:name')}
              onChangeText={text => this.setState({ Username: text })}
              value={this.state.Username}
            />
            </Item>
          <Item
            regular
            style={{ backgroundColor: 'white', marginVertical: 10 }}>
            <Icon style={styles.iconSpec} active name='md-call' />
            <Input style={styles.inputSpec} placeholder={t('common:mobile')} keyboardType={'number-pad'} />
          </Item>
          <View style={{ marginTop:8, color: "#7f7f7f" }}>
          <Text style={{ fontFamily:Fonts.Cairo,color: "#7f7f7f" }}>{t('common:gender')}</Text>
          </View>
          <View style={{ flex:1, right: 12 }}>
          <RadioForm
              style={{ width: 350 - 30,flex:1, bottom:6}}
              dataSource={Gender}
              itemShowKey="label"
              itemRealKey="value"
              outerColor={'#ff6600'}
              labelColor={'#7f7f7f'}
              innerColor={'#ff6600'}
              initial={0}
              formHorizontal={true}
              labelHorizontal={true}
              onPress={(item) => this._onSelect(item)}
          />
          </View>
          <View style={{ flex:1, bottom: 12 }}></View>
          <Item
            regular
            style={{ backgroundColor: 'white', marginVertical: 10 }}>
            <Icon style={styles.iconSpec} active name='ios-mail' />
            <Input style={styles.inputSpec} placeholder= {t('common:email')} keyboardType={'email-address'} />
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
          <Item
            regular
            style={{ backgroundColor: 'white', marginVertical: 10 }}>
            <Icon style={styles.iconSpec} active name='md-lock' />
            <Input
            style={styles.inputSpec}
              placeholder={t('common:confirm_password')}
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
          <View style={{ marginTop:8,marginBottom:8, color: "#7f7f7f" }}>
          <Text style={{ fontFamily:Fonts.Cairo,color: "#7f7f7f" }}>{t('techsignup:upload_documents')}</Text>
          </View>
          <View style={styles.RowSpec}>
          <View style={{ marginTop:8,marginBottom:20, color: "#7f7f7f" }}>
          <Button  iconLeft dark>
            <Icon style={{color: "#ffffff",fontFamily:Fonts.Cairo}} name='ios-cloud-upload' />
            <Text style={{color: "#ffffff",fontFamily:Fonts.Cairo,}}>{t('common:browse')}</Text>
          </Button>
          </View>
          <View>
          <TouchableOpacity>
          <Text style={{color: "#7f7f7f",flex:1,fontFamily:Fonts.Cairo, bottom:6,fontSize:13,marginLeft:5}}> {t('techsignup:national_id')}</Text>
          </TouchableOpacity>
          </View></View>

          <View style={styles.RowSpec}>
          <View style={{ marginTop:8,marginBottom:20, color: "#7f7f7f" }}>
          <Button  iconLeft dark>
            <Icon style={{color: "#ffffff"}} name='ios-cloud-upload' />
            <Text style={{color: "#ffffff",fontFamily:Fonts.Cairo}}>{t('common:browse')}</Text>
          </Button>
          </View>
          <View>
          <TouchableOpacity>
          <Text style={{color: "#7f7f7f",flex:1, bottom:6,fontSize:13,marginLeft:5,fontFamily:Fonts.Cairo}}> {t('techsignup:training_certificate')}</Text>
          </TouchableOpacity>
          </View></View>
          <View style={styles.AgreeRowSpec}>
          <View style={{marginRight:15}}>
          <TouchableOpacity>
          <Icon style={{color: "#7f7f7f",fontSize:24, marginLeft:3, flex:1,left:8, top:2 }} name='md-checkbox' />
          </TouchableOpacity>
          </View>
           <View><Text style={{color:"#7f7f7f", fontSize:14, marginLeft:4,fontFamily:Fonts.Cairo}}>{t('common:agree')}</Text></View>
           <View>
           <TouchableOpacity onPress={() => navigate('TermsConditions')}>
           <Text style={{color:"#ff6600",fontSize:14, marginLeft:4,fontFamily:Fonts.Cairo}}>{t('common:terms_conditions')}</Text>
           </TouchableOpacity>
           </View>
          </View>
          <View style={styles.marginSpecAll}>
          <Button
            block
            style={styles.btnStyle}
            onPress={() => this.props.navigation.navigate('Dashboard')}>
            <Text style={styles.btnStyle}>{t('common:signup').toUpperCase()}</Text>
          </Button>
          </View>
          </Body>
          </CardItem>
            <CardItem footer>
            </CardItem>
         </Card>
         <View style={styles.account}>
         <View><Text style={{color: "#7f7f7f",fontFamily:Fonts.Cairo}}>{t('already_have_account')} </Text></View>
         <TouchableOpacity onPress={() => navigate('TechLogin')}>
         <Text style={{color: "#ff6600",fontFamily:Fonts.Cairo}}> {t('common:login')} </Text>
         </TouchableOpacity>
         </View>
        </Content>
      </Container>
      </ScrollView>
    );
  }
}
export default translate(['techsignup', 'common'], { wait: true })(TechSignUp);
