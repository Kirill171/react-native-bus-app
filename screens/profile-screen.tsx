import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logOut } from '@/store/authSlice';
import Parse from '@/config/parse-config';
import CustomButton from '@/components/custom-button';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);

  async function handlerLogOut() {
    await Parse.User.logOut();
    dispatch(logOut());
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.username}>Ваш логин - {user.username}</Text>
        <Text style={styles.email}>Ваша почта - {user.email}</Text>
        <Text
          style={[
            styles.status,
            { color: user.isAuthenticated ? '#28a745' : '#dc3545' },
          ]}
        >
          {user.isAuthenticated ? 'Авторизован' : 'Не авторизован'}
        </Text>
        <CustomButton title="Выйти из аккаунта" onPress={handlerLogOut} webWidth={'90%'} phoneWidth={'90%'}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    width: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    marginBottom: 16,
  },
});
