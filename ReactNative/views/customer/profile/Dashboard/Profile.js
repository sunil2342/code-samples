import * as React from 'react';
import {Platform, ScrollView, View, StyleSheet, Image, FlatList, ActivityIndicator, TouchableHighlight} from 'react-native';
import {Container, Form, Label, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input, Thumbnail, ListItem, List} from 'native-base';
import { AsyncStorage } from 'react-native';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import RadioForm from 'react-native-radio-form';
//Import Global Styles
import { Fonts } from '../../../../utils/Fonts';
export class Profile extends React.Component {
  constructor(props)
  {
    super(props);
  }

  render() {
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    const isIos = Platform.OS === 'ios'
    const SPACER_SIZE = 1000; //arbitrary size
    const TOP_COLOR = '#ffffff';
    const BOTTOM_COLOR = '#ffffff';
    const Gender = [{ label: t('common:male'), value: 'Male'},{ label: t('common:female'), value: 'Female'}];
    //var styles = require('./styles/en/SignUp.js');
    //if( i18next.language === 'ar') var styles = require('./styles/ar/SignUp.js');
    return (
      <ScrollView
      style={{backgroundColor: isIos ? BOTTOM_COLOR : TOP_COLOR }}
      contentContainerStyle={{backgroundColor: TOP_COLOR}}
      contentInset={{top: -SPACER_SIZE}}
      contentOffset={{y: SPACER_SIZE}}>
      {isIos && <View style={{height: SPACER_SIZE}} />}
      <Container>
       <Content style={{backgroundColor:"#ffffff"}}>
       <View>
       <View style={{ alignItems: 'center', paddingVertical: 30 }}>
         <Thumbnail large style={{width:140, height:140,borderRadius: 70}} source={require('./profile.png')} />
         <View>
         <Text style={{marginTop:9, color:"#232323",fontSize:18,fontFamily:Fonts.SFUIDisplay}}>John Doe</Text>
         </View>
         <View>
         <Text style={{ color:"#7f7f7f",fontSize:15,fontFamily:Fonts.SFUIDisplay}}>johndoe@demomail.com</Text>
         </View>
       </View>
         <View style={{width:"86%", marginLeft:"7%", marginRight:"7%", marginBottom:50,}}>
         <View style={{ marginTop:8, color: "#7f7f7f" }}>
         <Text style={{ fontFamily:Fonts.Cairo,color: "#7f7f7f" }}>{t('common:mobile')}</Text>
         </View>
         <View>
         <Item
           style={{ backgroundColor: 'white', marginVertical: 1 }}>
           <Icon  active name='md-call' />
           <Input  placeholder={t('common:mobile')} keyboardType={'number-pad'} />
         </Item>
         </View>
         <View style={{ marginTop:15, color: "#7f7f7f" }}>
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
         <View style={{ marginTop:8, color: "#7f7f7f" }}>
         <Text style={{ fontFamily:Fonts.Cairo,color: "#7f7f7f" }}>{t('common:mobile')}</Text>
         </View>
         <View>
         <Item
           style={{ backgroundColor: 'white', marginVertical: 1 }}>
           <Icon  active name='md-call' />
           <Input  placeholder={t('common:mobile')} keyboardType={'number-pad'} />
         </Item>
         </View>
         <View style={{ marginTop:8, color: "#7f7f7f" }}>
         <Text style={{ fontFamily:Fonts.Cairo,color: "#7f7f7f" }}>{t('common:mobile')}</Text>
         </View>
         <View>
         <Item
           style={{ backgroundColor: 'white', marginVertical: 1 }}>
           <Icon  active name='md-call' />
           <Input  placeholder={t('common:mobile')} keyboardType={'number-pad'} />
         </Item>
         </View>
         </View>
         </View>
       </Content>
     </Container>
     </ScrollView>
    );
  }
}
export default translate(['profile', 'common'], { wait: true })(Profile);
