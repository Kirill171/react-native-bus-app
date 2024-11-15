import React, { useState, forwardRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ReactDatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { setDate } from '@/store/searchSlice';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDateInput = forwardRef<TouchableOpacity, { value: string; onClick: () => void }>(
  ({ value, onClick }, ref) => (
    <TouchableOpacity onPress={onClick} ref={ref} style={styles.dateField}>
      <Text style={styles.dateText}>{value}</Text>
      <Text style={styles.clue}>Дата</Text>
    </TouchableOpacity>
  )
);

const DatePicker = () => {
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
            customInput={<CustomDateInput value={formatDate(date)} onClick={() => { }} />}
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
    alignItems: 'center',
    width: '90%',
  },
  clue: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: 'gray',
    fontSize: 12,
  },
  dateField: {
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

const customStyleSheet = document.styleSheets[0] || document.createElement('style');
if (customStyleSheet instanceof CSSStyleSheet) {
  customStyleSheet.insertRule(`
    .react-datepicker-wrapper {
      width: 100% !important;
    }
  `, customStyleSheet.cssRules.length);
  customStyleSheet.insertRule(`
    .r-width-e7q0ms {
      align-self: center;
    }
  `, customStyleSheet.cssRules.length);
}

export default DatePicker;
