import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

import BusTripData from '@/types/bus-trip-data';
import Attributes from '@/types/attributes';

import { useDispatch } from 'react-redux';
import { setBusTripData, setBusTripId } from '@/store/searchSlice';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  'Результаты поиска': undefined;
  'Бронирование билета': undefined;
};

export default function ResultsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Результаты поиска'>>();
  const { busTripsData } = useSelector((state: RootState) => state.search);
  const busTripsArray: BusTripData[] = busTripsData ? busTripsData : [];
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  function navigateToTicketScreen(busTripData: Attributes, busTripId: string) {
    navigation.navigate('Бронирование билета');
    dispatch(setBusTripData(busTripData));
    dispatch(setBusTripId(busTripId));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.container, { width: width > 700 ? '40%' : '90%' }]}>
      <Text style={styles.title}>Результаты поиска:</Text>
        {busTripsArray.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.row}>
              <View style={styles.leftBlock}>
                <View style={styles.timeAndDateContainer}>
                  <Text style={styles.timeText}>
                    {new Date(item.attributes.departureTime.iso).toLocaleString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <Text style={styles.dateText}>
                    {new Date(item.attributes.departureTime.iso).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: 'long',
                      weekday: 'short',
                    }).split(',').reverse().join(', ')}
                  </Text>
                </View>
                <Text style={styles.cityText}>{item.attributes.fromCity}</Text>
              </View>

              <View style={styles.rightBlock}>
                <Text style={styles.timeText}>
                  {new Date(item.attributes.arrivalTime.iso).toLocaleString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.cityText}>{item.attributes.toCity}</Text>
                <Text style={styles.remainingSeats}>Свободно {item.attributes.remainingSeats} мест</Text>
              </View>
            </View>

            <View style={styles.line}></View>

            <View style={styles.column}>
              <View style={styles.bottomBlock}>
                <TouchableOpacity style={styles.bookButton} onPress={() => navigateToTicketScreen(item.attributes, item.id)}>
                  <Text style={styles.bookButtonText}>Забронировать</Text>
                  <Text style={styles.bookButtonText}>{item.attributes.price} Br за 1 место</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  leftBlock: {
    width: '50%',
  },
  timeAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: 'gray',
    marginLeft: 15,
  },
  rightBlock: {
    alignItems: 'flex-end',
    width: '50%',
  },
  remainingSeats: {
    color: 'gray',
    marginVertical: 15,
  },
  timeText: {
    fontSize: 20,
    color: 'black',
  },
  cityText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  bottomBlock: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  bookButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  line: {
    height: 1,
    backgroundColor: 'gray',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
});
