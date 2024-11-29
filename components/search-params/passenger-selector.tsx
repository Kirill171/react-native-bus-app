import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { setPassengers } from '@/store/searchSlice';

const PassengerSelector = () => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [passengerCount, setPassengerCount] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleSelect = (count: number) => {
    setPassengerCount(count);
    dispatch(setPassengers(count));
    closeModal();
  };

  const getPassengerText = (count: number) => {
    if (count === 1) return '1 пассажир';
    if (count > 1 && count < 5) return `${count} пассажира`;
    return `${count} пассажиров`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={[styles.selector, { width: width > 700 ? '30%' : '90%' }]}>
        <Text style={styles.clue}>Пассажиры:</Text>
        <Text style={styles.countText}>{getPassengerText(passengerCount)}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: width > 700 ? '30%' : '90%' }]}>
            {[1, 2, 3, 4, 5].map((count) => (
              <TouchableOpacity key={count} onPress={() => handleSelect(count)} style={styles.optionButton}>
                <Text style={styles.optionText}>{getPassengerText(count)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={closeModal} style={styles.doneButton}>
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  clue: {
    position: 'absolute',
    top: 5,
    left: 10,
    color: 'gray',
    fontSize: 12,
  },
  countText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    alignSelf: 'center',
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

export default PassengerSelector;
