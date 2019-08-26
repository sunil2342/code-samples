import React from 'react';
import { Dimensions } from 'react-native';

export const ScreenSize = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};
export const ColorTheme = {
    black: '#000000',
    white: 'white',
    orangetext: '#f8b580',
    yellow: '#feeb6a'
}//ffca3c
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
