import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, SafeAreaView } from 'react-native';
import Parse from 'parse/react-native';

const TripsScreen = () => {
  const [flights, setFlights] = useState<Parse.Object[]>([]);

  useEffect(() => {
    const fetchFlights = async () => {
      const Flight = Parse.Object.extend('Flights');
      const query = new Parse.Query(Flight);
      try {
        const results = await query.find();
        setFlights(results);
      } catch (error) {
        console.error('Ошибка при загрузке рейсов:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить рейсы.');
      }
    };

    fetchFlights();
  }, []);

  const handleAddFlight = () => {
    const Flight = Parse.Object.extend('Flights');
    const newFlight = new Flight();
    newFlight.set('name', 'Новый рейс');
    newFlight.set('departure', 'Москва');
    newFlight.set('destination', 'Санкт-Петербург');
    newFlight.save().then(() => {
      Alert.alert('Успех', 'Рейс добавлен!');
      setFlights((prevFlights) => [...prevFlights, newFlight]);
    }).catch((error) => {
      console.error('Ошибка при добавлении рейса:', error);
      Alert.alert('Ошибка', 'Не удалось добавить рейс.');
    });
  };

  const handleDeleteFlight = (flightId: string) => {
    const Flight = Parse.Object.extend('Flights');
    const query = new Parse.Query(Flight);
    query.get(flightId).then((flight) => {
      return flight.destroy();
    }).then(() => {
      Alert.alert('Успех', 'Рейс удален!');
      setFlights(flights.filter((flight) => flight.id !== flightId));
    }).catch((error) => {
      console.error('Ошибка при удалении рейса:', error);
      Alert.alert('Ошибка', 'Не удалось удалить рейс.');
    });
  };

  return (
    <SafeAreaView>
      <Text>Управление рейсами</Text>
      <Button title="Добавить рейс" onPress={handleAddFlight} />
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.get('name')}</Text>
            <Button title="Удалить" onPress={() => handleDeleteFlight(item.id)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default TripsScreen;
