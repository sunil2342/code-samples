import React from 'react';
import {View,StyleSheet,Text, TextInput} from 'react-native';


const InputBorder = ({ value, onChangeText, placeholder, secureTextEntry }) =>
{
return (
  <View>
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
  input:{
    marginRight: '18%',
    marginLeft: '18%',
    marginTop: 20,
    padding: 8,
    color: '#7f7f7f',
    borderColor: '#979798',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    fontSize: 15,
    fontWeight: '700',
    width: '64%'
  }
})

export { InputBorder };
