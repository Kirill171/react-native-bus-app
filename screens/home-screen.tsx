import React from 'react';
import { StyleSheet, ImageBackground, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState } from '@/store';
import { logOut } from '@/store/authSlice';
import Parse from '@/config/parse-config';
import CustomButton from '@/components/custom-button';
import BackGroundImage from '@/assets/back-ground.jpg';
import ModalSitySelector from '@/components/city-selector';
import DatePicker from '@/components/date-picker';
import LogoView from '@/components/logo-view';
import PassengerSelector from '@/components/passenger-selector';
import SearchButton from '@/components/search-buttom';

export default function HomeScreene() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);

  async function handlerLogOut() {
    await Parse.User.logOut();
    dispatch(logOut());
  }

  return (
    <ImageBackground style={styles.container} source={BackGroundImage} >
      <SafeAreaView>
        <LogoView />

        <ModalSitySelector clue='Откуда?' isFromCity={true} />
        <ModalSitySelector clue='Куда?' isFromCity={false} />

        <DatePicker />

        <PassengerSelector />

        <SearchButton />

        <CustomButton title={`Выйти с аккаунта - ${user.username}`} onPress={handlerLogOut} />

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
});