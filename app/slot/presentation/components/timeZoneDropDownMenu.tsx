import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormatHelper from '@/app/utils/formatHelper';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const TimeZoneDropdown = ({ value, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Zone</Text>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={styles.picker}
      >
        {FormatHelper.getTimeZones().map((tz) => (
          <Picker.Item label={tz} value={tz} key={tz} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  
});
