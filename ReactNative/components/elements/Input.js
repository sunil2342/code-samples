import React from 'react';
import {View,StyleSheet,Text, TextInput} from 'react-native';


const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) =>
{
return (
  <View>
  <Text style={styles.label}>{ label }</Text>
   <TextInput
   autoCorrect={false}
   onChangeText={onChangeText}
   placeholder={placeholder}
   style={styles.input}
   secureTextEntry={secureTextEntry}
   value={value}
  />
  </View>
)
}

const styles = StyleSheet.create({
  container:{
    marginTop: 10,
    width: '80%',
    borderColor: '#eee',
    borderBottomWidth: 2,
  },
  label:{
    paddingRight: '7.5%',
    paddingLeft: '7.5%',
    paddingBottom: 15,
    paddingTop: 15,
    color: '#232323',
    fontSize: 16,
    fontWeight: '100',
    width: '85%'
  },
  input:{
    marginRight: '7.5%',
    marginLeft: '7.5%',
    paddingBottom: 15,
    color: '#7f7f7f',
    borderColor: '#979798',
    borderBottomWidth: 1,
    fontSize: 15,
    fontWeight: '700',
    width: '85%'
  }
})

export { Input };
