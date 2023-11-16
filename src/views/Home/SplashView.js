/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { useEffect } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native'; // Import hook navigasi
import { MainStyle } from '../../AppStyles';

export default function SplashView() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.dispatch(StackActions.replace('Login'));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [navigation]);
  return (
    <View style={MainStyle.container}>
      <View style={styles.main}>
        <Image
          style={{width: 183, height: 183}}
          source={require('../../assets/images/barbecue_1.png')}></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#F5F5F5',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
