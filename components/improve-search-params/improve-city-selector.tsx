import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  setImproveFromCity,
  setImproveToCity
} from '@/store/searchSlice';

interface ImproveModalCitySelectorProps {
  propsCity: string;
  isFromCity: boolean;
}

const ImproveModalCitySelector = ({
  propsCity,
  isFromCity
}: ImproveModalCitySelectorProps) => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [selectedCity, setSelectedCity] = useState(propsCity);
  const [modalVisible, setModalVisible] = useState(false);

  const cities = [
    'Минск',
    'Гомель',
    'Могилёв',
    'Витебск',
    'Гродно',
    'Брест',
    'Бобруйск',
    'Барановичи'
  ];

  useEffect(() => {
    setSelectedCity(propsCity || 'Выберите город');
  }, [propsCity]);

  const selectCity = (city: string) => {
    setSelectedCity(city);
    if (isFromCity) {
      dispatch(setImproveFromCity(city));
    } else {
      dispatch(setImproveToCity(city));
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.selector}
      >
        <Text style={styles.cityText}>{selectedCity}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType='slide'>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { width: width > 700 ? '30%' : '90%' }
            ]}
          >
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                onPress={() => selectCity(city)}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>{city}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.doneButton}
            >
              <Text style={styles.doneText}>Готово</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%'
  },
  selector: {
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
  cityText: {
    fontSize: 16,
    color: '#333'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    alignSelf: 'center',
    width: '90%',
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center'
  },
  optionText: {
    fontSize: 16,
    color: '#333'
  },
  doneButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5
  },
  doneText: {
    color: 'white',
    fontSize: 16
  }
});

export default ImproveModalCitySelector;
