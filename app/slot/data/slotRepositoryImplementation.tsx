import { SlotEntity } from "../data/slotEntity";
import { Slot } from "../domain/slot";
import { SlotRepository } from "../domain/slotRepository";
import { SlotDatabase } from "./slotDataBase";
import moment from 'moment-timezone';
import { fromZonedTime,toZonedTime } from 'date-fns-tz'

export class SlotRepositoryImplementation implements SlotRepository {
    private static _instance: SlotRepositoryImplementation;

    private constructor() {
      // Private constructor to prevent direct instantiation
    }
  
    static getInstance(): SlotRepositoryImplementation {
      if (!SlotRepositoryImplementation._instance) {
        SlotRepositoryImplementation._instance = new SlotRepositoryImplementation();
      }
      return SlotRepositoryImplementation._instance;
    }
  
  async getSlots(timeZone?: string, date?: Date, time?: Date):  Promise<Slot[]> {
    console.log('getSlots timeZone', timeZone);
    if(timeZone){
      let now = new Date();
      if(date && time){
         now = moment(date)
        .set({
          hour: time!.getHours(),
          minute: time!.getMinutes(),
          second: 0,
          millisecond: 0,
        })
        .utc().toDate();
      }
     
    //   const slots = await SlotDatabase.getAllSlots();
    //   const availableSlots = slots.filter(slot => {
    //     const nowInSlotZone = moment.tz(now, slot.timeZone);
    //     console.log('slotStart', nowInSlotZone);
    //     const slotStart = moment.utc(slot.startTime).tz(slot.timeZone);
    //     const adjustedNow = nowInSlotZone.add(slot.bufferDuration, 'minutes');
    // console.log('adjustedNow', adjustedNow, 'slotStart', slotStart);
    //     return adjustedNow.isBefore(slotStart);
    //   });
    
    //   return availableSlots;
    const slots = await SlotDatabase.getAllSlots();
      const availableSlots = slots.filter(slot => {
    try {
      // Convert slot's start time to the selected time zone
      // const slotStartTimeInUTC = fromZonedTime(
      //   `${slot.startDate} ${slot.startTime}`,
      //   slot.timeZone
      // );
      const slotStartTimeInSelectedTZ = toZonedTime(
        slot.startTime,
        timeZone
      );

      // Calculate the time before which the slot is unavailable (current time + buffer)
      const unavailableUntil = new Date(now.getTime() + slot.bufferDuration * 60 * 1000);

      // Check if the slot's start time in the selected time zone is after the unavailable until time
      return slotStartTimeInSelectedTZ > unavailableUntil;

    } catch (error) {
      console.error('Error processing slot:', error);
      return false; // Skip problematic slots
    }
    });
    return availableSlots;
    }
    return await SlotDatabase.getAllSlots();
  };

  async createSlot(slot: Slot): Promise<boolean> {
    const generatedSlots:Array<Slot> =  this.generateTimeSlots(slot);
    for (const generatedSlot of generatedSlots) {
     const result = await SlotDatabase.insertSlot(generatedSlot);
     if(!result){
      return false;
     }
    }
    return true;
  };

  getSlotsByTimeZone(timeZone: string): Slot[]{
    
    return [];
  };

  generateTimeSlots(slot: Slot): Slot[] {
    console.log('slot', slot);

    const daysArray = this.getDaysArray(slot.startDate, slot.endDate);

    const generatedSlots: Array<Slot> = [];
  
    for (const currentDate of daysArray) {
      const startHour = slot.startTime.getHours();
      const startMinute = slot.startTime.getMinutes();
      const endHour = slot.endTime.getHours();
      const endMinute = slot.endTime.getMinutes();
  
      // Create a moment for the start of the day at the correct time and timezone
      let slotStartTime = moment.tz(currentDate, slot.timeZone)
        .hour(startHour)
        .minute(startMinute)
        .second(0)
        .millisecond(0);
  
      const dayEndTime = moment.tz(currentDate, slot.timeZone)
        .hour(endHour)
        .minute(endMinute)
        .second(0)
        .millisecond(0);
  
      while (slotStartTime.isBefore(dayEndTime)) {
        const slotEndTime = slotStartTime.clone().add(slot.slotDuration, 'minutes');
  console.log('slotEndTime', slotEndTime, 'slotStartTime', slotStartTime);
        if (slotEndTime.isSameOrBefore(dayEndTime)) {
          generatedSlots.push(new Slot(
            slotStartTime.utc().toDate(),  // startDate (same day)
            slotStartTime.utc().toDate(),  // endDate (same day, can be used differently if needed)
            slotStartTime.utc().toDate(),  // startTime
            slotEndTime.utc().toDate(),    // endTime
            slot.timeZone,
            slot.breakDuration,
            slot.slotDuration,
            slot.bufferDuration
          ));
  
          // Move to next slot (end time + break)
          slotStartTime = slotEndTime.clone().add(slot.breakDuration, 'minutes');
        } else {
          break;
        }
      }
    }
  
    return generatedSlots;
  }

   getDaysArray(start:Date, end:Date) {
    const dateArray = [];
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate)); // Create a new Date object to avoid modifying the original
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }
}