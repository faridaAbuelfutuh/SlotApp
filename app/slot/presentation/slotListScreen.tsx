import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { GetSlotslotUseCase } from '../domain/getSlotsUseCase';
import { SlotRepositoryImplementation } from '../data/slotRepositoryImplementation';
import moment from 'moment-timezone';
import { TimeZoneDropdown } from './components/timeZoneDropDownMenu';
import { Slot } from '../domain/slot';
import { useSlotContext } from '@/app/context/slotContext';
// import moment from 'moment-timezone';
import { useFocusEffect } from '@react-navigation/native';
import FormatHelper from '@/app/utils/formatHelper';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SlotListScreen() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const { state, dispatch } = useSlotContext();
const timeZones = FormatHelper.getTimeZones();
  const [timeZone, setTimeZone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const useCase = new GetSlotslotUseCase(SlotRepositoryImplementation.getInstance());
  // const timeZones = moment.tz.names(); // Or use a shorter static list if you prefer

  useEffect(() => {
    const loadSlots = async () => {
      const results = await useCase.execute(); // You implement this
      setSlots(results);
      dispatch({ type: 'SET_SLOTS', payload: results });
      // filterSlots(results, timeZone);
    };

    loadSlots();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const loadSlots = async () => {
        const dbSlots = await useCase.execute();
        dispatch({ type: 'SET_SLOTS', payload: dbSlots });
        setLoading(false);
      };

      loadSlots();

     
    }, [])
  );



  const handleTimeZoneChange = async (zone: string) => {
    setLoading(true);
    setTimeZone(zone);
    const results = await useCase.execute(zone); // You implement this
    setSlots(results);
    setLoading(false);
    dispatch({ type: 'SET_SLOTS', payload: results });
  };
  if (loading) {
    return <Text>Loading...</Text>
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Available Slots</Text>

      {/* <RNPickerSelect
        onValueChange={handleTimeZoneChange}
        items={timeZones.map(tz => ({ label: tz, value: tz }))}
        value={timeZone}
        placeholder={{ label: 'Select Time Zone', value: null }}
      /> */}
      <TimeZoneDropdown
        value={timeZone}
        onChange={(tz) => handleTimeZoneChange(tz)}
      />

      <FlatList
        data={state.slots}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const start = moment(item.startTime).tz(item.timeZone).format('HH:mm');
          const end = moment(item.endTime).tz(item.timeZone).format('HH:mm');
          const date = moment(item.startDate).tz(item.timeZone).format('DD/MM/YYYY');

          return (
            <View style={styles.slotCard}>
              <Text>{`${date} | ${start} - ${end}`}</Text>
              <Text>{`Time Zone: ${item.timeZone}`}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 32
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  slotCard: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});

