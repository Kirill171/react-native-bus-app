import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import BusTripData from '@/types/bus-trip-data';
import HomeScreene from './home-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultsScreen() {
  const { busTripsData } = useSelector((state: RootState) => state.search);
  const busTripsArray: BusTripData[] = busTripsData ? busTripsData : [];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Результаты поиска</Text>
      <FlatList
        data={busTripsArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.leftBlock} >
              <Text style={styles.itemText}>
                {new Date(item.attributes.departureTime.iso).toLocaleString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text>{item.attributes.fromCity}</Text>
            </View>
            <View style={styles.rightBlock} >
              <Text style={styles.itemText}>
                {new Date(item.attributes.arrivalTime.iso).toLocaleString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text>{item.attributes.toCity}</Text>
              <Text style={styles.remainingSeats}>Свободно {item.attributes.remainingSeats} мест</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  leftBlock: {
    width: '50%',
  },
  rightBlock: {
    alignItems: 'flex-end',
    width: '50%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  remainingSeats: {
    color: 'gray',
    marginHorizontal: 5,
  }
});
