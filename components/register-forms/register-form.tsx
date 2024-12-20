import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import Parse from '@/config/parse-config';
import { logIn } from '@/store/authSlice';
import CustomButton from '@/components/custom-button';
import FloatingLabelInput from '@/components/floating-label-input';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { width } = useWindowDimensions();

  const isValidUsername = (username: string) => /^[a-zA-Z]+$/.test(username);
  const isValidPassword = (password: string) => password.length >= 6;
  const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleRegister = async () => {
    if (!isValidUsername(username)) {
      setError('Логин должен содержать только английские буквы.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Пароль должен быть больше 6 символов.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Введите корректный адрес электронной почты.');
      return;
    }

    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
      await user.signUp();

      const acl = new Parse.ACL();
      acl.setReadAccess(user.id, true);
      acl.setWriteAccess(user.id, true);

      acl.setRoleReadAccess('Super Admin', true);
      acl.setRoleWriteAccess('Super Admin', true);

      user.setACL(acl);
      await user.save();

      dispatch(logIn({ username, email }));
    } catch (error) {
      setError('Ошибка при регистрации');
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
      <FloatingLabelInput
        label="Почта"
        value={email}
        onChangeText={setEmail}
        style={{ width: width > 700 ? '30%' : '90%' }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <CustomButton title="Создать аккаунт" onPress={handleRegister} />
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