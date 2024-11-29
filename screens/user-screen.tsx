import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, SafeAreaView } from 'react-native';
import Parse from 'parse/react-native';

const UsersScreen = () => {
  const [users, setUsers] = useState<Parse.User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const query = new Parse.Query(Parse.User);
      try {
        const results = await query.find();
        setUsers(results);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить пользователей.');
      }
    };

    fetchUsers();
  }, []);

  const handleChangeRole = (userId: string, role: string) => {
    const user = Parse.User.createWithoutData(userId);
    user.fetch().then(() => {
      const rolesRelation = user.relation('roles');
      const Role = Parse.Object.extend('Role');
      const query = new Parse.Query(Role);
      query.equalTo('name', role);
      query.first().then((roleObj) => {
        if (roleObj) {
          rolesRelation.add(roleObj);
          user.save().then(() => {
            Alert.alert('Успех', `Роль пользователя изменена на ${role}`);
          }).catch((error) => {
            console.error('Ошибка при изменении роли:', error);
            Alert.alert('Ошибка', 'Не удалось изменить роль.');
          });
        }
      });
    }).catch((error) => {
      console.error('Ошибка при загрузке пользователя:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить пользователя.');
    });
  };

  return (
    <SafeAreaView>
      <Text>Управление пользователями</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.get('username')}</Text>
            <Button title="Сделать админом" onPress={() => handleChangeRole(item.id, 'Admin')} />
            <Button title="Сделать пользователем" onPress={() => handleChangeRole(item.id, 'User')} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default UsersScreen;
