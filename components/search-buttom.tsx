import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Parse from '@/config/parse-config';
import { RootState } from '@/store';

export default function SearchButton() {
    const { fromCity, toCity, date, passengers } = useSelector((state: RootState) => state.search);
    const handlerSearch = async () => {
        console.log(fromCity);
        console.log(toCity);
        console.log(date);
        console.log(passengers);
        

        const query = new Parse.Query('Flights');
        query.equalTo('fromCity', fromCity);
        query.equalTo('toCity', toCity);
        query.equalTo('date', date);
        query.equalTo('passengers', passengers);

        const results = await query.find();
        console.log(results);
    };
    return (
        <TouchableOpacity style={styles.button} onPress={handlerSearch}>
            <Text style={styles.buttonText}>Найти</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        height: 50,
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
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