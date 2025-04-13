import FormatHelper from "@/app/utils/formatHelper";

export class Slot {
  id?: number
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    timeZone: string;
    breakDuration: number;
    slotDuration: number;
    bufferDuration: number

    constructor( startDate: Date, endDate: Date, startTime: Date, endTime: Date, timeZone: string, breakDuration: number, slotDuration: number, bufferDuration: number,id?: number,) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.startTime = startTime;
      this.endTime = endTime;
      this.timeZone = timeZone;
      this.breakDuration = breakDuration;
      this.slotDuration = slotDuration;
      this.bufferDuration = bufferDuration;
      this.id = id
    }

     formatSlot() {
      return   {
        startDate: FormatHelper.formatDate(this.startDate),
        endDate: FormatHelper.formatDate(this.endDate),
        startTime: FormatHelper.formatDate(this.startTime),
        endTime: FormatHelper.formatDate(this.endTime),
        timeZone: this.timeZone,
        breakDuration: this.breakDuration,
        slotDuration: this.slotDuration,
        bufferDuration: this.bufferDuration
      };
    }
  }