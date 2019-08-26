import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, Text, View, Button, ImageBackground, Image, TouchableOpacity } from 'react-native';
export class Language extends React.Component {
  constructor(props) {
   super(props)
 }
 LanguageSetAR = () =>
  {
     const { t, i18n, navigation } = this.props;
     this.props.navigation.navigate('Type');
     i18n.changeLanguage('ar');
  }
  LanguageSetEN = () =>
   {
      const { t, i18n, navigation } = this.props;
      this.props.navigation.navigate('Type');
      i18n.changeLanguage('en');
   }
 //hide react navigation
 static navigationOptions = ({ navigation }) => ({
  header: null,
 });
  render() {
    const { t, i18n, navigation } = this.props;
    const { navigate } = navigation;
    return (
      <ImageBackground source={require('../../images/language/language-type.png')} style={styles.MainContainer} >
          <View style={{ flex: 1,justifyContent: 'center' }}>
          <Text style={styles.SelectLang}>SELECT YOUR LANGUAGE</Text>
          </View>
          <View style={styles.RowItem}>
          <TouchableOpacity onPress = { this.LanguageSetEN }>
          <Image
              style={styles.ImageEn}
              source={require('../../images/language/en-language.png')}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress = { this.LanguageSetAR }>
          <Image
              style={styles.ImageAr}
              source={require('../../images/language/ar-language.png')}
          />
          </TouchableOpacity>
          </View>
          <View style={styles.RowItem}>
              <Text  style={styles.SelectEn}>ENGLISH</Text>
              <Text  style={styles.SelectAr}>ARABIC</Text>
          </View>

      </ImageBackground>
    );
  }
}
export default translate(['language', 'common'], { wait: true })(Language);
const styles = StyleSheet.create({
    MainContainer:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
        resizeMode: 'cover',
        flexDirection: 'column',
    },
    ImageAr: {
        alignSelf: 'center',
        width: 100,
        resizeMode: 'contain',
        marginLeft: 10,
        marginTop: 15,
    },
    ImageEn: {
        alignSelf: 'center',
        width: 100,
        resizeMode: 'contain',
        marginRight: 20,
        marginTop: 15,
    },
    SelectLang:
    {
        flex: 1,
        top:235,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        fontWeight:"bold"
    },
    SelectEn:
    {
        flex: 1,
        bottom: 60,
        left: 95,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        fontWeight:"100",
        color: "#000000"

    },
    SelectAr:
    {
        flex: 1,
        bottom: 60,
        left: 45,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        fontWeight:"100",
        color: "#000000"
    },
    RowItem:
    {
        flex: 1,
        bottom:1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginBottom: 10,
    }

});
