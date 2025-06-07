import React, { useState, forwardRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import { useDispatch } from 'react-redux';
import {
  setDepartureTime,
  setArrivalTime
} from '@/store/searchSlice';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDateInput = forwardRef<
  any,
  { value: string; onClick: () => void }
>(({ value, onClick }, ref) => (
  <TouchableOpacity
    onPress={onClick}
    ref={ref}
    style={styles.dateFieldWeb}
  >
    <Text style={styles.dateText}>{value}</Text>
  </TouchableOpacity>
));

registerLocale('ru', ru);

interface improveDatePickerProps {
  propsDate: number;
  isDepartureTime: boolean;
}

const ImproveDatePicker = ({
  propsDate,
  isDepartureTime
}: improveDatePickerProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (propsDate) {
      const newDate = new Date(propsDate);
      if (!isNaN(newDate.getTime())) {
        setLocalDate(newDate);
      }
    }
  }, [propsDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [date, setLocalDate] = useState(new Date(propsDate));
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate: Date) => {
    setLocalDate(selectedDate);
    if (isDepartureTime) {
      dispatch(setDepartureTime(selectedDate.getTime()));
    } else {
      dispatch(setArrivalTime(selectedDate.getTime()));
    }
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
              if (selectedDate && isDepartureTime) {
                setLocalDate(selectedDate);
                dispatch(setDepartureTime(selectedDate.getTime()));
              }
              if (selectedDate && !isDepartureTime) {
                setLocalDate(selectedDate);
                dispatch(setArrivalTime(selectedDate.getTime()));
              }
            }}
            minDate={minimumDate}
            maxDate={maximumDate}
            showTimeSelect
            timeIntervals={5}
            dateFormat='dd.MM.yyyy HH:mm'
            dayClassName={(date) => highlightWeekends(date) || ''}
            customInput={
              <CustomDateInput
                value={formatDate(date)}
                onClick={() => {}}
              />
            }
            locale='ru'
            popperPlacement='top'
          />
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.dateField}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode='datetime'
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
    alignItems: 'center'
  },
  webContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%'
  },
  dateField: {
    width: '100%',
    padding: 15,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 5
  },
  dateFieldWeb: {
    width: '100%',
    padding: 15,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 5
  },
  dateText: {
    fontSize: 16,
    color: '#333'
  }
});

if (Platform.OS === 'web') {
  const customStyleSheet =
    document.styleSheets[0] || document.createElement('style');
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

export default ImproveDatePicker;
