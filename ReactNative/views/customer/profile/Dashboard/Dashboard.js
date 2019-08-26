import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
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
  Thumbnail,
  ListItem,
  List,
} from 'native-base';
//import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';

const menuData = require('./movies.json');
console.log(menuData);

export default class DashboardTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [
        {
          id: '1',
          title: 'Star Wars',
          releaseYear: '1977',
          icon: 'ios-globe-outline',
        },
        {
          id: '2',
          title: 'Back to the Future',
          releaseYear: '1985',
          icon: 'ios-bicycle-outline',
        },
        {
          id: '3',
          title: 'The Matrix',
          releaseYear: '1999',
          icon: 'ios-bus-outline',
        },
        {
          id: '4',
          title: 'Inception',
          releaseYear: '2010',
          icon: 'ios-cafe-outline',
        },
        {
          id: '5',
          title: 'Interstellar',
          releaseYear: '2014',
          icon: 'ios-camera-outline',
        },
      ],
      menuItems: menuData,
      removeItem : this._removeItem
    };
  }

  render() {
    return (
      <View>
        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Thumbnail large source={require('./profile.png')} />
          <Text>Dashboard Tab</Text>
        </View>
        <View style={{ backgroundColor: '#eeeeee', marginHorizontal: 10 }}>
          <List>
            <FlatList
              data={this.state.menuItems.movies}
              renderItem={({ item }) => (
                <ListItem
                  icon
                  button
                  onPress={() => {}}>
                  <Left>
                    <Icon name={item.icon} size={25} />
                  </Left>
                  <Body>
                    <Text>{item.title}</Text>
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
