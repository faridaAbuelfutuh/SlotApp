import { SlotEntity } from "../data/slotEntity";
import { Slot } from "../domain/slot";
import { SlotRepository } from "../domain/slotRepository";
import { SlotDatabase } from "./slotDataBase";

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
  
  async getSlots(timeZone?: string):  Promise<Slot[]> {
    if(timeZone){
      return await SlotDatabase.getSlotsByTimeZone(timeZone);
    }
    return await SlotDatabase.getAllSlots();
  };

  async createSlot(slot: Slot): Promise<boolean> {
    return await SlotDatabase.insertSlot(slot);
  };

  getSlotsByTimeZone(timeZone: string): Slot[]{
    return [];
  };
}