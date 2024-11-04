import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface ModalCitySelectorProps {
  clue: string;
}

export default function ModalCitySelector({ clue }: ModalCitySelectorProps) {
  const [selectedCity, setSelectedCity] = useState('Выберите город');
  const [modalVisible, setModalVisible] = useState(false);

  const cities = ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест', 'Бобруйск', 'Барановичи'];

  const selectCity = (city: string) => {
    setSelectedCity(city);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cityButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.cityText}>{selectedCity}</Text>
        <Text style={styles.clue}>{clue}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {cities.map((city) => (
              <TouchableOpacity key={city} style={styles.cityOption} onPress={() => selectCity(city)}>
                <Text style={styles.cityOptionText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  clue: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: 'gray',
    fontSize: 12,
  },
  cityButton: {
    width: '90%',
    height: 50,
    padding: 10,
    backgroundColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    justifyContent: 'center',
  },
  cityText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 100,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  scrollViewContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  cityOption: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    marginVertical: 5,
  },
  cityOptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
});
