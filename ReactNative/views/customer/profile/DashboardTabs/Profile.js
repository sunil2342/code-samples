import * as React from 'react';
import {Platform, View, StyleSheet, Image, FlatList, ActivityIndicator, TouchableHighlight} from 'react-native';
import {Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input, Thumbnail, ListItem, List} from 'native-base';
import { AsyncStorage } from 'react-native';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import RadioForm from 'react-native-radio-form';
export default class Profile extends React.Component {
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
      <View>
        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Thumbnail large source={require('./profile.png')} />
          <Text>Dashboard Tab</Text>
        </View>
      </View>

    );
  }
}
