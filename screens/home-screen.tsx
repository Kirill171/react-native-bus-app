import React from 'react';
import { StyleSheet, ImageBackground, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackGroundImage from '@/assets/back-ground.jpg';
import ModalSitySelector from '@/components/search-params/city-selector';
import DatePicker from '@/components/search-params/date-picker';
import LogoView from '@/components/logo-view';
import PassengerSelector from '@/components/search-params/passenger-selector';
import SearchButton from '@/components/search-params/search-buttom';

export default function HomeScreene() {


  return (
    <ImageBackground style={styles.container} source={BackGroundImage} >
      <SafeAreaView>
        <LogoView />

        <ModalSitySelector clue='Откуда?' isFromCity={true} />
        <ModalSitySelector clue='Куда?' isFromCity={false} />

        <DatePicker />

        <PassengerSelector />

        <SearchButton />

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    resizeMode: "cover",
  },
});