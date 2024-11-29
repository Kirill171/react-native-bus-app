import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { setFromCity, setToCity } from '@/store/searchSlice';

interface ModalCitySelectorProps {
  clue: string;
  isFromCity: boolean;
}

const ModalCitySelector = ({ clue, isFromCity }: ModalCitySelectorProps) => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [selectedCity, setSelectedCity] = useState('Выберите город');
  const [modalVisible, setModalVisible] = useState(false);

  const cities = ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест', 'Бобруйск', 'Барановичи'];

  const selectCity = (city: string) => {
    setSelectedCity(city);
    if (isFromCity) {
      dispatch(setFromCity(city));
    } else {
      dispatch(setToCity(city));
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.selector, { width: width > 700 ? '30%' : '90%' }]}>
        <Text style={styles.clue}>{clue}</Text>
        <Text style={styles.cityText}>{selectedCity}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: width > 700 ? '30%' : '90%' }]}>
            {cities.map((city) => (
              <TouchableOpacity key={city} onPress={() => selectCity(city)} style={styles.optionButton}>
                <Text style={styles.optionText}>{city}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.doneButton}>
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
  },
  selector: {
    width: '90%',
    padding: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  clue: {
    position: 'absolute',
    top: 5,
    left: 10,
    color: 'gray',
    fontSize: 12,
  },
  cityText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignSelf: 'center',
    width: '90%',
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  doneButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  doneText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ModalCitySelector;
