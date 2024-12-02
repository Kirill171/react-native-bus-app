import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  placeholderTextColor = 'gray',
  isPassword = false,
  style,
}: {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  placeholderTextColor?: string;
  isPassword?: boolean;
  style?: object;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.label,
          isFocused || value ? styles.focusedLabel : styles.unfocusedLabel,
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.focusedInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? '' : label}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    position: 'absolute',
    left: 25,
    top: 25,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  unfocusedLabel: {
    color: 'black',
  },
  focusedLabel: {
    top: -10,
    fontSize: 14,
    color: 'black',
  },
  input: {
    height: 70,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  focusedInput: {
    borderColor: 'black',
  },
});

export default FloatingLabelInput;
