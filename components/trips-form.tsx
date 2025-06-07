import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Platform
} from 'react-native';
import ImproveModalCitySelector from './improve-search-params/improve-city-selector';
import ImproveDatePicker from './improve-search-params/improve-date-picker';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setImproveFromCity,
  setImproveToCity,
  setDepartureTime,
  setArrivalTime
} from '@/store/searchSlice';
import { RootState } from '@/store';

interface TripsFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

type FormData = {
  fromCity: string;
  toCity: string;
  departureTime: number;
  arrivalTime: number;
  price: string;
  driverName: string;
  driverPhone: string;
  busBrand: string;
  busColor: string;
  busNumberPlate: string;
  totalSeats: string;
  remainingSeats: string;
};

const TripsForm: React.FC<TripsFormProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const {
    improveFromCity,
    improveToCity,
    departureTime,
    arrivalTime
  } = useSelector((state: RootState) => state.search);
  const [formData, setFormData] = useState<FormData>({
    fromCity: '',
    toCity: '',
    departureTime: Date.now(),
    arrivalTime: Date.now(),
    price: '',
    driverName: '',
    driverPhone: '',
    busBrand: '',
    busColor: '',
    busNumberPlate: '',
    totalSeats: '',
    remainingSeats: ''
  });

  const placeholders: { [key in keyof FormData]: string } = {
    fromCity: 'Город отправления',
    toCity: 'Город прибытия',
    departureTime: 'Время отправления (гггг-мм-дд чч:мм)',
    arrivalTime: 'Время прибытия (гггг-мм-дд чч:мм)',
    price: 'Цена (в рублях)',
    driverName: 'Имя водителя',
    driverPhone: 'Телефон водителя',
    busBrand: 'Марка автобуса',
    busColor: 'Цвет автобуса',
    busNumberPlate: 'Номерной знак автобуса',
    totalSeats: 'Всего мест',
    remainingSeats: 'Оставшиеся места'
  };

  useEffect(() => {
    if (initialData) {
      dispatch(setImproveFromCity(initialData.fromCity));
      dispatch(setImproveToCity(initialData.toCity));
      dispatch(
        setDepartureTime(
          typeof initialData.departureTime === 'number'
            ? initialData.departureTime
            : initialData.departureTime.getTime()
        )
      );
      dispatch(
        setArrivalTime(
          typeof initialData.arrivalTime === 'number'
            ? initialData.arrivalTime
            : initialData.arrivalTime.getTime()
        )
      );

      setFormData({
        fromCity: initialData.fromCity || '',
        toCity: initialData.toCity || '',
        departureTime: initialData.departureTime || Date.now(),
        arrivalTime: initialData.arrivalTime || Date.now(),
        price: initialData.price || '',
        driverName: initialData.driverName || '',
        driverPhone: initialData.driverPhone || '',
        busBrand: initialData.busBrand || '',
        busColor: initialData.busColor || '',
        busNumberPlate: initialData.busNumberPlate || '',
        totalSeats: (initialData.totalSeats || '').toString(),
        remainingSeats: (initialData.remainingSeats || '').toString()
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value };
      if (field === 'totalSeats') {
        const totalSeats = parseInt(value, 10) || 0;
        const remainingSeats =
          parseInt(updatedFormData.remainingSeats, 10) || 0;

        if (remainingSeats > totalSeats) {
          updatedFormData.remainingSeats = totalSeats.toString();
        }
      }

      return updatedFormData;
    });
  };

  const handleSave = () => {
    const totalSeats = parseInt(formData.totalSeats, 10);
    const remainingSeats = parseInt(formData.remainingSeats, 10);

    if (!improveFromCity || !improveToCity) {
      Alert.alert('Ошибка', 'Поля "Откуда" и "Куда" обязательны.');
      return;
    }

    if (remainingSeats > totalSeats) {
      Alert.alert(
        'Ошибка',
        'Оставшихся мест не может быть больше общего количества мест.'
      );
      if (Platform.OS === 'web') {
        alert(
          'Оставшихся мест не может быть больше общего количества мест.'
        );
      }
      return;
    }

    const updatedData = {
      ...formData,
      fromCity: improveFromCity,
      toCity: improveToCity,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      totalSeats,
      remainingSeats
    };

    onSave(updatedData);
    dispatch(setImproveFromCity(''));
    dispatch(setImproveToCity(''));
    dispatch(setDepartureTime(Date.now()));
    dispatch(setArrivalTime(Date.now()));
  };

  return (
    <View
      style={[
        styles.editForm,
        { width: width > 700 ? '40%' : '100%' }
      ]}
    >
      <Text style={styles.tableHeader}>
        {initialData ? 'Редактирование рейса' : 'Добавление рейса'}
      </Text>
      {Object.keys(formData).map((key) => {
        const typedKey = key as keyof FormData;
        if (key === 'fromCity') {
          return (
            <View key={typedKey}>
              <ImproveModalCitySelector
                propsCity={formData.fromCity}
                isFromCity={true}
              />
            </View>
          );
        }
        if (key === 'toCity') {
          return (
            <View key={typedKey}>
              <ImproveModalCitySelector
                propsCity={formData.toCity}
                isFromCity={false}
              />
            </View>
          );
        }
        if (key === 'departureTime') {
          return (
            <View key={typedKey} style={styles.fon}>
              <ImproveDatePicker
                propsDate={formData.departureTime}
                isDepartureTime={true}
              />
            </View>
          );
        }
        if (key === 'arrivalTime') {
          return (
            <View key={typedKey}>
              <ImproveDatePicker
                propsDate={formData.arrivalTime}
                isDepartureTime={false}
              />
            </View>
          );
        }
        return (
          <TextInput
            placeholderTextColor={'gray'}
            key={typedKey}
            style={styles.input}
            placeholder={placeholders[typedKey]}
            value={String(formData[typedKey] ?? '')}
            onChangeText={(text) => handleInputChange(typedKey, text)}
          />
        );
      })}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Сохранить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
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
  editForm: {
    borderRadius: 10,
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#fff'
  },
  tableHeader: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  greenButton: {
    backgroundColor: '#4CAF50'
  },
  deleteButton: {
    backgroundColor: '#f44336'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  fon: {
    zIndex: 1000
  }
});

export default TripsForm;
