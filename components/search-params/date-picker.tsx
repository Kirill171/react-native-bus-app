import React, { useState, forwardRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import { useDispatch } from 'react-redux';
import { setDate } from '@/store/searchSlice';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDateInput = forwardRef<any, { value: string; onClick: () => void }>(
  ({ value, onClick }, ref) => (
    <TouchableOpacity onPress={onClick} ref={ref} style={styles.dateFieldWeb}>
      <Text style={styles.dateText}>{value}</Text>
      <Text style={styles.clue}>Дата:</Text>
    </TouchableOpacity>
  )
);

registerLocale('ru', ru);

export default function DatePicker() {
  const dispatch = useDispatch();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const [date, setLocalDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    setLocalDate(selectedDate);
    dispatch(setDate(selectedDate.toISOString()));
    hideDatePicker();
  };

  const highlightWeekends = (date: Date) => {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const isOutOfRange = date < minimumDate || date > maximumDate;
    if (isOutOfRange) return 'out-of-range-day';
    return isWeekend ? 'weekend-day' : undefined;
  };

  const minimumDate = new Date();
  const maximumDate = new Date();
  maximumDate.setDate(minimumDate.getDate() + 14);

  return (
    <>
      {Platform.OS === 'web' ? (
        <View style={styles.webContainer}>
          <ReactDatePicker
            selected={date}
            onChange={(selectedDate: Date | null) => {
              if (selectedDate) {
                setLocalDate(selectedDate);
                dispatch(setDate(selectedDate.toISOString()));
              }
            }}
            minDate={minimumDate}
            maxDate={maximumDate}
            dateFormat="dd.MM.yyyy"
            dayClassName={(date) => highlightWeekends(date) || ''}
            customInput={<CustomDateInput value={formatDate(date)} onClick={() => { }} />}
            locale="ru"
            wrapperClassName="react-datepicker-wrapper"
            popperPlacement="top"
          />
        </View>
      ) : (
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  webContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '30%',
  },
  clue: {
    position: 'absolute',
    top: 5,
    left: 10,
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
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  dateFieldWeb: {
    width: '100%',
    height: 50,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

if (Platform.OS === 'web') {
  const customStyleSheet = document.styleSheets[0] || document.createElement('style');
  if (customStyleSheet instanceof CSSStyleSheet) {
    customStyleSheet.insertRule(
      `.react-datepicker__month-container {
        transition: transform 1s ease-in-out;
      }`,
      customStyleSheet.cssRules.length
    );
    customStyleSheet.insertRule(
      `.weekend-day {
        color: red !important;
        font-weight: bold;
      }`,
      customStyleSheet.cssRules.length
    );
    customStyleSheet.insertRule(
      `.react-datepicker-wrapper {
        width: 100% !important;
      }`,
      customStyleSheet.cssRules.length
    );
  }
}