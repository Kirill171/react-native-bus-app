import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, useWindowDimensions, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  webWidth?: string | number,
  phoneWidth?: string | number,
}

export default function CustomButton({ title, onPress, webWidth, phoneWidth }: CustomButtonProps) {
  const { width } = useWindowDimensions();
  let buttonWidth: string | number;

  buttonWidth = (width > 700 ? '30%' : '90%');
  if (webWidth && phoneWidth) {
    buttonWidth = (width > 700 ? webWidth : phoneWidth)
  }

  return (
    <TouchableOpacity style={[styles.button, { width: buttonWidth as ViewStyle['width'] }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});