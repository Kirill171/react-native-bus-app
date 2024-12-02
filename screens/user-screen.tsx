import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, useWindowDimensions } from 'react-native';
import Parse from '@/config/parse-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const UsersScreen = () => {
  const [users, setUsers] = useState<Parse.User[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
  const { width } = useWindowDimensions();

  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  const getUserRoles = async (userId: string) => {
    try {
      const user = Parse.User.createWithoutData(userId);
      await user.fetch();

      const rolesQuery = new Parse.Query('_Role');
      rolesQuery.equalTo('users', user);

      const roles = await rolesQuery.find();

      if (roles.length > 0) {
        return roles.map(role => role.get('name'));
      } else {
        return ['User'];
      }
    } catch (error) {
      console.error('Ошибка при получении ролей:', error);
      return ['Ошибка при получении ролей'];
    }
  };

  const loadRoles = async () => {
    const rolesMap: Record<string, string[]> = {};
    for (const user of users) {
      const roles = await getUserRoles(user.id);
      rolesMap[user.id] = roles;
    }
    setUserRoles(rolesMap);
  };

  const fetchUsers = async () => {
    const query = new Parse.Query(Parse.User);
    try {
      const results = await query.find();
      setUsers(results);
      await loadRoles();
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить пользователей.');
    }
  };

  useEffect(() => {
    const loadRoles = async () => {
      const rolesMap: Record<string, string[]> = {};
      for (const user of users) {
        const roles = await getUserRoles(user.id);
        rolesMap[user.id] = roles;
      }
      setUserRoles(rolesMap);
    };

    if (users.length > 0) {
      loadRoles();
    }
  }, [users]);

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      const user = Parse.User.createWithoutData(userId);
      await user.fetch();

      const Role = Parse.Object.extend('_Role');
      const query = new Parse.Query(Role);
      query.equalTo('name', role);

      const roleObj = await query.first();

      if (roleObj) {
        const rolesRelation = roleObj.relation('users');

        const currentRoles = await getUserRoles(userId);
        const rolePromises = [];

        if (role === 'User' && currentRoles.includes('Admin')) {
          const adminRoleQuery = new Parse.Query(Role);
          adminRoleQuery.equalTo('name', 'Admin');
          const adminRole = await adminRoleQuery.first();

          if (adminRole) {
            const adminRelation = adminRole.relation('users');
            adminRelation.remove(user);
            adminRole.save();
          }
        }

        if (role === 'Admin' && currentRoles.includes('User')) {
          const userRoleQuery = new Parse.Query('_Role');
          userRoleQuery.equalTo('name', 'User');
          const userRole = await userRoleQuery.first();

          if (userRole) {
            const userRoleRelation = userRole.relation('users');
            userRoleRelation.remove(user);
            userRole.save();
          }
        }

        rolesRelation.add(user);
        await roleObj.save();

        await fetchUsers();
        Alert.alert('Успех', `Роль пользователя изменена на ${role}`);
      } else {
        Alert.alert('Ошибка', 'Роль не найдена.');
      }
    } catch (error) {
      console.error('Ошибка при изменении роли:', error);
      Alert.alert('Ошибка', 'Не удалось изменить роль.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const user = Parse.User.createWithoutData(userId);
      await user.destroy();

      setUsers(users.filter(u => u.id !== userId));
      Alert.alert('Успех', 'Пользователь удален.');
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      Alert.alert('Ошибка', 'Не удалось удалить пользователя.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Управление пользователями</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {users.map((user) => (
          <View key={user.id} style={[styles.userCard, { width: width > 700 ? '60%' : '100%' }]}>
            <Text style={styles.username}>Пользователь: {user.get('username')}</Text>
            <Text style={styles.username}>
              Роль пользователя: {userRoles[user.id] ? userRoles[user.id].join(', ') : 'Загрузка...'}
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.adminButton]}
                onPress={() => handleChangeRole(user.id, 'Admin')}
              >
                <Text style={styles.buttonText}>Сделать админом</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.userButton]}
                onPress={() => handleChangeRole(user.id, 'User')}
              >
                <Text style={styles.buttonText}>Сделать пользователем</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDeleteUser(user.id)}
              >
                <Text style={styles.buttonText}>Удалить аккаунт</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: '#4CAF50',
  },
  userButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UsersScreen;