import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, useWindowDimensions } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function CustomButton({ title, onPress }: CustomButtonProps) {
  const { width } = useWindowDimensions();

  return (
    <TouchableOpacity style={[styles.button, {width: width > 700 ? '30%' : '90%'}]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
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