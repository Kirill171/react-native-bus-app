import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Linking, Alert, SafeAreaView } from 'react-native';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import CustomButton from '@/components/custom-button';
import Parse from '@/config/parse-config';
import { useFocusEffect } from '@react-navigation/native';

export default function BookingScreen() {
  const { busTripData, busTripId } = useSelector((state: RootState) => state.search);
  const { width } = useWindowDimensions();
  const [isBooked, setIsBooked] = useState(false);
  const [remainingSeats, setRemainingSeats] = useState(busTripData?.remainingSeats || 0);

  const handlePhoneCall = (phoneNumber: string | undefined) => {
    if (phoneNumber) {
      const phoneUrl = `tel:${phoneNumber}`;
      Linking.openURL(phoneUrl);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkBookingStatus = async () => {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser || !busTripId) {
          console.warn('Нет авторизованного пользователя или ID рейса');
          return;
        }

        const User = Parse.Object.extend('User');
        const BusTrip = Parse.Object.extend('BusTrips');

        const userPointer = new User();
        userPointer.id = currentUser.id;

        const busTripPointer = new BusTrip();
        busTripPointer.id = busTripId;

        const query = new Parse.Query('Bookings');
        query.equalTo('userId', userPointer);
        query.equalTo('busTripId', busTripPointer);

        query.first()
          .then((booking) => {
            setIsBooked(!!booking);
          })
          .catch((error) => {
            console.error('Ошибка при проверке бронирования:', error);
          });

      };

      checkBookingStatus();
    }, [busTripId])
  );

  const handleBooking = async () => {
    try {
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        Alert.alert("Ошибка", "Пользователь не авторизован");
        return;
      }

      const BusTrip = Parse.Object.extend("BusTrips");
      const queryBusTrip = new Parse.Query(BusTrip);
      const busTrip = await queryBusTrip.get(busTripId);

      if (!busTrip) {
        Alert.alert("Ошибка", "Рейс не найден");
        return;
      }

      const Booking = Parse.Object.extend("Bookings");
      const queryBooking = new Parse.Query(Booking);

      const userPointer = new Parse.User();
      userPointer.id = currentUser.id;

      const busTripPointer = new Parse.Object("BusTrips");
      busTripPointer.id = busTripId;

      queryBooking.equalTo("userId", userPointer);
      queryBooking.equalTo("busTripId", busTripPointer);

      const booking = await queryBooking.first();

      if (!isBooked) {
        if (booking) {
          Alert.alert("Ошибка", "Вы уже забронировали этот рейс.");
          return;
        }

        const newBooking = new Booking();
        newBooking.set("userId", userPointer);
        newBooking.set("busTripId", busTripPointer);
        await newBooking.save();

        busTrip.set("remainingSeats", remainingSeats - 1);
        await busTrip.save();

        setRemainingSeats(remainingSeats - 1);
        setIsBooked(true);
        Alert.alert("Успех", "Бронирование выполнено!");
      } else {
        if (!booking) {
          Alert.alert("Ошибка", "Бронирование не найдено.");
          return;
        }

        await booking.destroy();

        busTrip.set("remainingSeats", remainingSeats + 1);
        await busTrip.save();

        setRemainingSeats(remainingSeats + 1);
        setIsBooked(false);
        Alert.alert("Успех", "Бронирование отменено!");
      }
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      Alert.alert("Ошибка", "Произошла ошибка при обработке бронирования.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { width: width > 700 ? '60%' : '100%', }]}>
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.labelText}>Отправка через</Text>
            <Text style={styles.valueText}>
              {(busTripData?.departureTime.iso)
                ? (() => {
                  const departureTime = new Date(busTripData.departureTime.iso).getTime();
                  const currentTime = new Date().getTime();
                  const durationInMinutes = Math.max(0, Math.abs(departureTime - currentTime) / 60000);
                  const hours = Math.floor(durationInMinutes / 60);
                  const minutes = Math.ceil(durationInMinutes % 60);
                  return `${hours} часов ${minutes} минут`;
                })()
                : 'Не известно'}
            </Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.row}>
            <Text style={styles.labelText}>Стоимость билета</Text>
            <Text style={styles.valueText}>{busTripData?.price} Br</Text>
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.valueText}>От: "{busTripData?.fromCity}"</Text>
            <Text style={styles.valueText}>До: "{busTripData?.toCity}"</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.row}>
            <Text style={styles.valueText}>Отправка в: {busTripData?.departureTime.iso ? new Date(busTripData?.departureTime.iso).toLocaleString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            }) : 'Не известно'}</Text>
            <Text style={styles.valueText}>Прибытие в: {busTripData?.arrivalTime.iso ? new Date(busTripData?.arrivalTime.iso).toLocaleString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            }) : 'Не известно'}</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.row}>
            <Text style={styles.valueText}>Время пути</Text>
            <Text style={styles.valueText}>
              {(busTripData?.departureTime.iso && busTripData?.arrivalTime.iso)
                ? (() => {
                  const departureTime = new Date(busTripData.departureTime.iso).getTime();
                  const arrivalTime = new Date(busTripData.arrivalTime.iso).getTime();
                  const durationInMinutes = Math.abs(arrivalTime - departureTime) / 60000;
                  const hours = Math.floor(durationInMinutes / 60);
                  const minutes = durationInMinutes % 60;
                  return `${hours} часа ${minutes} минут`;
                })()
                : 'Не известно во сколько'}
            </Text>
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.labelText}>Транспорт</Text>
            <Text style={styles.valueText}>{busTripData?.busBrand}</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.row}>
            <Text style={styles.labelText}>Цвет</Text>
            <Text style={styles.valueText}>{busTripData?.busColor}</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.row}>
            <Text style={styles.labelText}>Номер автобуса</Text>
            <Text style={styles.valueText}>{busTripData?.busNumberPlate}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.labelText}>Водитель</Text>
            <Text style={styles.valueText}>{busTripData?.driverName}</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.row}>
            <Text style={styles.labelText}>Тел. водителя</Text>
            <TouchableOpacity onPress={() => handlePhoneCall(busTripData?.driverPhone)}>
              <Text style={styles.valuePhoneText}>{busTripData?.driverPhone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: 'center', }}>
          <CustomButton
            title={isBooked ? 'Разбронировать' : 'Забронировать'}
            onPress={handleBooking}
            webWidth={'100%'}
            phoneWidth={'90%'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    paddingVertical: 20,
    alignSelf: 'center',
  },
  block: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    fontSize: 18,
  },
  labelText: {
    fontSize: 16,
    color: 'gray',
  },
  valueText: {
    fontSize: 16,
  },
  valuePhoneText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  line: {
    height: 1,
    backgroundColor: 'gray',
    marginHorizontal: 20,
  },
});