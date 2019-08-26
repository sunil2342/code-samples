import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

export const TYPES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}
const Button = ({ onPress, children }) => {
  return(
    <TouchableOpacity onPress={ onPress } style={styles.button}>
    <Text style={styles.text}> { children } </Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button:{
    marginRight: '18%',
    marginLeft: '18%',
    marginTop: 20,
    width: '64%',
    padding: 8,
    backgroundColor: '#ff6600',
    borderRadius: 1,
    alignItems: 'center',
  },
  text:{
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  }
  })

export { Button };
