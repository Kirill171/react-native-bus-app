import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, useWindowDimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import Parse from '@/config/parse-config';
import { useFocusEffect } from '@react-navigation/native';

import BusTripData from '@/types/bus-trip-data';
import Attributes from '@/types/attributes';

import { useDispatch } from 'react-redux';
import { setBusTripData, setBusTripId } from '@/store/searchSlice';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  'Мои билеты': undefined;
  'Бронирование билета': undefined;
};


export default function BookedScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Мои билеты'>>();
  const { busTripsData } = useSelector((state: RootState) => state.search);
  const busTripsArray: BusTripData[] = busTripsData ? busTripsData : [];
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [bookedTrips, setBookedTrips] = useState<BusTripData[]>([]);

  function navigateToTicketScreen(busTripData: Attributes, busTripId: string) {
    navigation.navigate('Бронирование билета');
    dispatch(setBusTripData(busTripData));
    dispatch(setBusTripId(busTripId));
  }

  const fetchBookedTrips = async () => {
    try {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        console.error("Пользователь не авторизован");
        return;
      }

      const Booking = Parse.Object.extend("Bookings");
      const bookingQuery = new Parse.Query(Booking);
      bookingQuery.equalTo("userId", currentUser);

      const bookingResults = await bookingQuery.find();

      const busTripIds = bookingResults.map((booking) => booking.get("busTripId").id);

      const BusTrip = Parse.Object.extend("BusTrips");
      const busTripQuery = new Parse.Query(BusTrip);
      busTripQuery.containedIn("objectId", busTripIds);

      const busTripResults = await busTripQuery.find();

      const formattedTrips: BusTripData[] = busTripResults.map((trip) => ({
        id: trip.id,
        className: trip.className || "BusTrip",
        attributes: {
          fromCity: trip.get("fromCity") || "Неизвестно",
          toCity: trip.get("toCity") || "Неизвестно",
          date: { iso: trip.get("departureTime").toISOString() },
          departureTime: { iso: trip.get("departureTime").toISOString() },
          arrivalTime: { iso: trip.get("arrivalTime").toISOString() },
          totalSeats: trip.get("totalSeats") || 0,
          remainingSeats: trip.get("remainingSeats") || 0,
          price: trip.get("price") || 0,
          driverName: trip.get("driverName") || "Неизвестно",
          driverPhone: trip.get("driverPhone") || "Неизвестно",
          busNumberPlate: trip.get("busNumberPlate") || "Неизвестно",
          busBrand: trip.get("busBrand") || "Неизвестно",
          busColor: trip.get("busColor") || "Неизвестно",
        },
      }));

      setBookedTrips(formattedTrips);
    } catch (error) {
      console.error("Ошибка при получении забронированных рейсов:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookedTrips();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { width: width > 700 ? '40%' : '100%' }]}>
      <Text style={styles.title}>Ваши билеты:</Text>
      <FlatList
        data={bookedTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>

              <View style={styles.leftBlock} >
                <View style={styles.timeAndDateContainer}>
                  <Text style={styles.timeText}>
                    {new Date(item.attributes.departureTime.iso).toLocaleString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <Text style={styles.dateText}>
                    {new Date(item.attributes.departureTime.iso).toLocaleString('ru-Ru', {
                      day: '2-digit',
                      month: 'long',
                      weekday: 'short',
                    }).split(',').reverse().join(', ')}
                  </Text>
                </View>
                <Text style={styles.cityText}>{item.attributes.fromCity}</Text>
              </View>

              <View style={styles.rightBlock} >
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
                  <Text style={styles.bookButtonText}>Подробнее</Text>
                </TouchableOpacity>
              </View>
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
    alignSelf: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    margin: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  }
});