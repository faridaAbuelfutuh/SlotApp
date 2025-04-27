import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
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
import DateTimePicker from '@react-native-community/datetimepicker';


export default function SlotListScreen() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const { state, dispatch } = useSlotContext();
  const timeZones = FormatHelper.getTimeZones();
  const [timeZone, setTimeZone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const useCase = new GetSlotslotUseCase(SlotRepositoryImplementation.getInstance());
  // const timeZones = moment.tz.names(); // Or use a shorter static list if you prefer
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
    const results = await useCase.execute(zone, selectedDate, selectedTime); // You implement this
    setSlots(results);
    setLoading(false);
    dispatch({ type: 'SET_SLOTS', payload: results });
  };

  const handleDateChange = async (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date){
      setLoading(true);
      setSelectedDate(date);
      const results = await useCase.execute(timeZone, date, selectedTime); // You implement this
      setSlots(results);
      setLoading(false);
      dispatch({ type: 'SET_SLOTS', payload: results });
    } 
  };

  const handleTimeChange = async (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time){
      setLoading(true);
      setSelectedTime(time);
      const results = await useCase.execute(timeZone, selectedDate, time); // You implement this
      setSlots(results);
      setLoading(false);
      dispatch({ type: 'SET_SLOTS', payload: results });
    }
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
      <Button title="Pick Date" onPress={() => setShowDatePicker(true)}  />
      <View style={styles.separator} />
      <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <FlatList
        data={state.slots}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          let start = moment.utc(item.startTime).tz(item.timeZone).format('HH:mm');
          let end = moment.utc(item.endTime).tz(item.timeZone).format('HH:mm');
          let date = moment.utc(item.startDate).tz(item.timeZone).format('DD/MM/YYYY');

          if (timeZone != '' && timeZone != item.timeZone) {
            start = moment(item.startTime).tz(timeZone).format('HH:mm');
            end = moment(item.endTime).tz(timeZone).format('HH:mm');
            date = moment(item.startDate).tz(timeZone).format('DD/MM/YYYY');

          }

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
  separator:{
    height: 10
  }
});

