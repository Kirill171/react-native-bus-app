import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import BackGroundImage from '@/assets/back-ground.jpg';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  return (
    <ImageBackground style={styles.container} source={BackGroundImage}>
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default BackgroundWrapper;
