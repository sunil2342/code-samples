import * as React from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
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
  ListItem,
  List,
} from 'native-base';

//import { Ionicons } from '@expo/vector-icons';

export default class SubmenuScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('pageTitle', 'Submenu'),
    };
  };

  render() {
    const { navigation } = this.props;
    const submenuItems = navigation.getParam('submenu', 'NO-ID');

    return (
      <View>
        <View
          style={{
            backgroundColor: '#eeeeee',
            marginHorizontal: 10,
            marginVertical: 20,
          }}>
          <List>
            <FlatList
              data={submenuItems}
              renderItem={({ item }) => (
                <ListItem
                  icon
                  button
                  onPress={() => this.props.navigation.navigate('Submenu')}>
                  <Left>
                    <Icon name="ios-globe-outline" size={25} />
                  </Left>
                  <Body>
                    <Text>{item.show}</Text>
                  </Body>
                  <Right>
                    <Icon
                      active
                      name="arrow-forward"
                      style={{ color: '#333333' }}
                    />
                  </Right>
                </ListItem>
              )}
              keyExtractor={(item, index) => index}
            />
          </List>
        </View>
      </View>
    );
  }
}
