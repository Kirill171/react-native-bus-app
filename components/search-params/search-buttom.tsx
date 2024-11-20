import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Parse from '@/config/parse-config';
import BusTripData from '@/types/bus-trip-data';
import { setBusTripsData } from '@/store/searchSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    'Поиск рейсов': undefined;
    'Результаты поиска': undefined;
};

export default function SearchButton() {
    const { fromCity, toCity, date, passengers, } = useSelector((state: RootState) => state.search);
    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Поиск рейсов'>>();


    const handlerSearch = async () => {
        const selectedDate = new Date(date);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const query = new Parse.Query('BusTrips');
        query.equalTo('fromCity', fromCity);
        query.equalTo('toCity', toCity);
        query.greaterThanOrEqualTo('departureTime', selectedDate);
        query.lessThanOrEqualTo('departureTime', endOfDay);
        query.greaterThanOrEqualTo('remainingSeats', passengers);

        const results = await query.find();
        const busTripsData: BusTripData[] = results.map((parseObject: any) => {
            const attributes = parseObject.toJSON();
            return {
                id: parseObject.id,
                className: parseObject.className,
                attributes: {
                    fromCity: attributes.fromCity,
                    toCity: attributes.toCity,
                    date: attributes.date,
                    departureTime: attributes.departureTime,
                    arrivalTime: attributes.arrivalTime,
                    totalSeats: attributes.totalSeats,
                    remainingSeats: attributes.remainingSeats,
                    price: attributes.price,
                    driverName: attributes.driverName,
                    driverPhone: attributes.driverPhone,
                    busNumberPlate: attributes.busNumberPlate,
                    busBrand: attributes.busBrand,
                    busColor: attributes.busColor,
                },
            };
        });

        dispatch(setBusTripsData(busTripsData));
        navigation.navigate('Результаты поиска');
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handlerSearch}>
                <Text style={styles.buttonText}>Найти</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '90%',
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});