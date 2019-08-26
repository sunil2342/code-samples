import * as React from 'react';
import {View, StyleSheet, Image, FlatList, ActivityIndicator, TouchableHighlight} from 'react-native';
import {Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, Input, Thumbnail, ListItem, List} from 'native-base';
import { AsyncStorage } from 'react-native';
export default class Profile extends React.Component {
  constructor(props)
  {
    super(props);
  }

  render() {
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
