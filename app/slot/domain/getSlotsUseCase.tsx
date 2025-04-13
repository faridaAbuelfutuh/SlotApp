import { SlotEntity } from "../data/slotEntity";
import { Slot } from "./slot";
import { SlotRepository } from "./slotRepository";


export class GetSlotslotUseCase {
  constructor(private slotRepo: SlotRepository) {}

  async execute(timeZone?: string): Promise<Slot[]> {
   return await this.slotRepo.getSlots(timeZone);
     
  }
}