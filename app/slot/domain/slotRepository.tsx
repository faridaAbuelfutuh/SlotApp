import { Slot } from "./slot";

export interface SlotRepository {
  getSlots(timeZone?: string, date?: Date, time?: Date):  Promise<Slot[]> ;

  createSlot(slot: Slot): Promise<boolean>;

  getSlotsByTimeZone(timeZone: string): Slot[];
}