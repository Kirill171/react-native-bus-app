import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import Parse from '@/config/parse-config';
import { logIn } from '@/store/authSlice';
import CustomButton from '@/components/custom-button';
import FloatingLabelInput from '@/components/floating-label-input';

export default function LoginForm() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    try {
      const user = await Parse.User.logIn(username, password);
      dispatch(logIn({ username: user.get('username'), email: user.get('email') }));
    } catch (err) {
      setError('Ошибка входа');
    }
  };

  return (
    <View style={styles.container}>
      <FloatingLabelInput
        label="Логин"
        value={username}
        onChangeText={setUsername}
        style={{ width: width > 700 ? '30%' : '90%' }}
      />
      <FloatingLabelInput
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        isPassword={true}
        style={{ width: width > 700 ? '30%' : '90%' }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <CustomButton title="Войти" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '90%',
    height: 70,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});