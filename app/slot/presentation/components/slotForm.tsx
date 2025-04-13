import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Slot } from '../../domain/slot';
import { TimeZoneDropdown } from './timeZoneDropDownMenu';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  onSubmit: (slot: Slot) => void;
}

export const SlotForm: React.FC<Props> = ({ onSubmit }) => {
  const [slot, setSlot] = useState<Slot>(new Slot(new Date(), new Date(), new Date(), new Date(), 'America/New_York', 0, 0, 0));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPicker, setShowPicker] = useState<{ field: string | null }>({ field: null });

  const handleChange = <K extends keyof Slot>(field: K, value: Slot[K]) => {
    setSlot(prev => {
      const updated = new Slot(
        prev.startDate,
        prev.endDate,
        prev.startTime,
        prev.endTime,
        prev.timeZone,
        prev.breakDuration,
        prev.slotDuration,
        prev.bufferDuration
      );

      updated[field] = value;
      return updated;
    });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!slot.timeZone) newErrors.timeZone = 'Time zone is required.';
    if (slot.breakDuration <= 0) newErrors.breakDuration = 'Break duration must be positive.';
    if (slot.slotDuration <= 0) newErrors.slotDuration = 'Slot duration must be positive.';
    if (slot.bufferDuration < 0) newErrors.bufferDuration = 'Buffer duration cannot be negative.';
    if (slot.startDate > slot.endDate) newErrors.endDate = 'End date must be after start date.';
    if (slot.startTime >= slot.endTime) newErrors.endTime = 'End time must be after start time.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(slot);
    } else {
      Alert.alert('Invalid input', 'Please fix the errors in the form.');
    }
  };

  const renderDateTimeButton = (label: string, value: Date, field: keyof Slot, mode: 'date' | 'time') => (
    <View style={styles.inputContainer}>
      <Text>{label}</Text>
      <Button
        title={mode === 'date' ? value.toLocaleDateString('en-GB') : value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        onPress={() => setShowPicker({ field })}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      {showPicker.field === field && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selected) => {
            if (selected) {
              handleChange(field, selected);
            }
            setShowPicker({ field: null });
          }}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Slot</Text>
      {renderDateTimeButton('Start Date', slot.startDate, 'startDate', 'date')}
      {renderDateTimeButton('End Date', slot.endDate, 'endDate', 'date')}
      {renderDateTimeButton('Start Time', slot.startTime, 'startTime', 'time')}
      {renderDateTimeButton('End Time', slot.endTime, 'endTime', 'time')}

      <View style={styles.inputContainer}>
        {/* <TextInput
          style={styles.input}
          value={slot.timeZone}
          onChangeText={(val) => handleChange('timeZone', val)}
        /> */}
        <TimeZoneDropdown
          value={slot.timeZone}
          onChange={(tz) => handleChange('timeZone', tz)}
        />
        {errors.timeZone && <Text style={styles.errorText}>{errors.timeZone}</Text>}
      </View>

      {['breakDuration', 'slotDuration', 'bufferDuration'].map((field) => (
        <View key={field} style={styles.inputContainer}>
          <Text>{field}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={slot[field as keyof Slot]!.toString()}
            onChangeText={(val) => handleChange(field as keyof Slot, parseInt(val) || 0)}
          />
          {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
      ))}

      <Button title="Submit Slot" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: 32 },
  inputContainer: { marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
