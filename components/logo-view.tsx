import { View, Text, Image, StyleSheet } from 'react-native';
import LogoImage from '@/assets/bus-logo.png';

export default function LogoView() {
  return (
    <View style={styles.logo}>
      <Image style={styles.logoImage} source={LogoImage} />
      <Text style={styles.logoText}>Jetset</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    maxHeight: 100,
    marginVertical: 75,
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
});