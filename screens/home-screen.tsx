import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '@/store';
import { logOut } from '@/store/authSlice';
import Parse from '@/config/parse-config';
import CustomButton from '@/components/custom-button';
import BackGroundImage from '@/assets/back-ground.jpg';
import LogoImage from '@/assets/bus-logo.png';
import ModalSitySelector from '@/components/city-selector';

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
        <View style={styles.logo}>
          <Image style={styles.logoImage} source={LogoImage} />
          <Text style={styles.logoText}>Jetset</Text>
        </View>

        <View style={styles.searchForm}>
          <ModalSitySelector clue='Откуда?' />
          <ModalSitySelector clue='Куда?' />
        </View>

        <View>
          <Text> ---Тут нужно сделать выбор даты поездки и может количества мест--- </Text>
        </View>

        <CustomButton title={`Выйти ${user.username}`} onPress={handlerLogOut} />

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  logo: {
    maxHeight: 100,
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 110,
    height: 100,
    resizeMode: 'stretch',
    marginLeft: -40,
    marginRight: 10,
  },
  logoText: {
    fontSize: 35,
    color: 'white',
  },
  searchForm: {

  }
});