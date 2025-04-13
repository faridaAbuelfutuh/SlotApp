import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { CreateSlotUseCase } from '../domain/createSlotUseCase';
import { Slot } from '../domain/slot';
import { SlotRepositoryImplementation } from '../data/slotRepositoryImplementation';
import { SlotForm } from './components/slotForm';
import { useSlotContext } from '@/app/context/slotContext';

const { dispatch } = useSlotContext();

export default function SlotScreen() {
 

  const handleSubmit = async (slot: Slot) => {
    const useCase = new CreateSlotUseCase( SlotRepositoryImplementation.getInstance());
    try {
      await useCase.execute(slot);
      dispatch({ type: 'ADD_SLOT', payload: slot });
      Alert.alert('Success', 'Slot inserted successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to insert slot');
    }
  };

  return <SlotForm onSubmit={handleSubmit} />;
}
