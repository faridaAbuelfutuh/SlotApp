import { SlotEntity } from "../data/slotEntity";
import { Slot } from "./slot";

export interface SlotRepository {
  getSlots(timeZone?: string):  Promise<Slot[]> ;

  createSlot(slot: Slot): Promise<boolean>;

  getSlotsByTimeZone(timeZone: string): Slot[];
}