import { Slot } from "../domain/slot";

export class SlotEntity {
    id?: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timeZone: string;
    breakDuration: number;
    slotDuration: number;
    bufferDuration: number;
  
    constructor(   
      id: number, 
      startDate: string,
      endDate: string,
      startTime: string,
      endTime: string,
      timeZone: string,
      breakDuration: number,
      slotDuration: number,
      bufferDuration: number
        
    ) {
      this.id = id;
      this.startDate = startDate;
      this.endDate = endDate;
      this.startTime = startTime;
      this.endTime = endTime;
      this.timeZone = timeZone;
      this.breakDuration = breakDuration;
      this.slotDuration = slotDuration;
      this.bufferDuration = bufferDuration;
    }

 
  }