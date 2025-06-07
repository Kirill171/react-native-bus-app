import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import Parse from '@/config/parse-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import TripForm from '@/components/trips-form';

const TripsScreen = () => {
  const [trips, setTrips] = useState<Parse.Object[]>([]);
  const [editTripData, setEditTripData] =
    useState<Parse.Object | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { width } = useWindowDimensions();

  useFocusEffect(
    React.useCallback(() => {
      const fetchTrips = async () => {
        const query = new Parse.Query('BusTrips');
        try {
          const results = await query.find();
          setTrips(results);
        } catch (error) {
          console.error('Ошибка при загрузке рейсов:', error);
          Alert.alert('Ошибка', 'Не удалось загрузить рейсы.');
        }
      };

      fetchTrips();
    }, [])
  );

  const handleAddTrip = () => {
    setIsAdding(true);
  };

  const saveTrip = async (
    tripData: Record<string, any>,
    tripId?: string
  ) => {
    try {
      const Trip = Parse.Object.extend('BusTrips');
      const trip = tripId
        ? trips.find((t) => t.id === tripId) || new Trip()
        : new Trip();

      Object.entries(tripData).forEach(([key, value]) => {
        if (key === 'departureTime' || key === 'arrivalTime') {
          trip.set(key, new Date(value));
        } else {
          trip.set(key, value);
        }
      });

      await trip.save();
      Alert.alert(
        'Успех',
        tripId ? 'Рейс обновлен!' : 'Рейс добавлен!'
      );
      setTrips((prevTrips) =>
        tripId
          ? prevTrips.map((t) => (t.id === tripId ? trip : t))
          : [...prevTrips, trip]
      );
      cancelEditOrAdd();
    } catch (error) {
      console.error('Ошибка при сохранении рейса:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить рейс.');
    }
  };

  const cancelEditOrAdd = () => {
    setEditTripData(null);
    setIsAdding(false);
  };

  const handleEditTrip = (tripId: string) => {
    const tripToEdit = trips.find((trip) => trip.id === tripId);
    if (tripToEdit) {
      setEditTripData(tripToEdit);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      const trip = trips.find((t) => t.id === tripId);
      if (trip) {
        await trip.destroy();
        setTrips(trips.filter((t) => t.id !== tripId));
        Alert.alert('Успех', 'Рейс удален!');
      }
    } catch (error) {
      console.error('Ошибка при удалении рейса:', error);
      Alert.alert('Ошибка', 'Не удалось удалить рейс.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Управление рейсами</Text>
      <ScrollView>
        {isAdding || editTripData ? (
          <TripForm
            initialData={editTripData?.attributes}
            onSave={(data) => saveTrip(data, editTripData?.id)}
            onCancel={cancelEditOrAdd}
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.addButton,
              { width: width > 700 ? '60%' : '100%' }
            ]}
            onPress={handleAddTrip}
          >
            <Text style={styles.addButtonText}>Добавить рейс</Text>
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.tripList,
            { width: width > 700 ? '60%' : '100%' }
          ]}
        >
          {trips.map((trip) => (
            <View
              key={trip.id}
              style={[
                styles.tripCard,
                { width: width > 700 ? '40%' : '100%' }
              ]}
            >
              <Text style={styles.tripName}>
                {`От: "${trip.get('fromCity')}" — До: "${trip.get(
                  'toCity'
                )}"`}
              </Text>
              <View style={styles.tripDetailsContainer}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>
                      Время отправления:
                    </Text>
                    <Text style={styles.detailValue}>
                      {new Date(
                        trip.get('departureTime')
                      ).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>
                      Время прибытия:
                    </Text>
                    <Text style={styles.detailValue}>
                      {new Date(
                        trip.get('arrivalTime')
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>Цена:</Text>
                    <Text style={styles.detailValue}>
                      {trip.get('price')} BYN
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>
                      Осталось мест:
                    </Text>
                    <Text style={styles.detailValue}>
                      {`${trip.get('remainingSeats')} из ${trip.get(
                        'totalSeats'
                      )}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>Водитель:</Text>
                    <Text style={styles.detailValue}>
                      {trip.get('driverName')}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>
                      Телефон водителя:
                    </Text>
                    <Text style={styles.detailValue}>
                      {trip.get('driverPhone')}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>
                      Номер автобуса:
                    </Text>
                    <Text style={styles.detailValue}>
                      {trip.get('busNumberPlate')}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.detailKey}>
                      Марка автобуса:
                    </Text>
                    <Text style={styles.detailValue}>
                      {trip.get('busBrand')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => handleEditTrip(trip.id)}
                >
                  <Text style={styles.buttonText}>Редактировать</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteTrip(trip.id)}
                >
                  <Text style={styles.buttonText}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333'
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  tripList: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    flexWrap: 'wrap'
  },
  tripCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center'
  },
  tripDetailsContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  column: {
    flex: 1,
    paddingHorizontal: 5
  },
  detailKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444'
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: '#2196F3'
  },
  deleteButton: {
    backgroundColor: '#f44336'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default TripsScreen;
