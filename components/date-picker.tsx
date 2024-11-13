import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePickerWeb from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { setDate } from '@/store/searchSlice';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = () => {
  const dispatch = useDispatch();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const [date, setLocalDate] = useState((new Date()));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    setLocalDate(selectedDate);
    dispatch(setDate(selectedDate.toISOString()));
    hideDatePicker();
  };

  const minimumDate = new Date();
  const maximumDate = new Date();
  maximumDate.setDate(minimumDate.getDate() + 14);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker} style={styles.dateField}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        <Text style={styles.clue}>Дата</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  clue: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: 'gray',
    fontSize: 12,
  },
  dateField: {
    width: '90%',
    height: 50,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  webInput: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});

export default DatePicker;
