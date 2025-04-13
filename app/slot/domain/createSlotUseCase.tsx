import { Slot } from "./slot";
import { SlotRepository } from "./slotRepository";


export class CreateSlotUseCase {
  constructor(private slotRepo: SlotRepository) {}

  async execute(slot: Slot): Promise<boolean> {
   return  await this.slotRepo.createSlot(slot);
     
  }
}