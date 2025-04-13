import * as SQLite from 'expo-sqlite';
import { Slot } from '../domain/slot';

const db = SQLite.openDatabaseSync('slot_app.db');


export class SlotDatabase {
    static async initialize() {
        console.log('initialize');
     const result = await db.runAsync(`CREATE TABLE IF NOT EXISTS slot (id INTEGER PRIMARY KEY NOT NULL, startDate TEXT NOT NULL, endDate TEXT NOT NULL, startTime TEXT NOT NULL, endTime TEXT NOT NULL, timeZone TEXT NOT NULL, breakDuration INTEGER, slotDuration INTEGER, bufferDuration INTEGER);`);
console.log('result', result);
    }



    static async insertSlot(slot: Slot): Promise<boolean> {
    const formatedSlot = slot.formatSlot();
    console.log('gereeee', formatedSlot);
        const result = await db.runAsync('INSERT INTO slot (startDate, endDate, startTime, endTime, timeZone, breakDuration, slotDuration, bufferDuration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',[ formatedSlot.startDate, formatedSlot.endDate, formatedSlot.startTime,formatedSlot.endTime, formatedSlot.timeZone, formatedSlot.breakDuration, formatedSlot.slotDuration, formatedSlot.bufferDuration]);
       if (result.changes > 0) {
        return true;
      }else{
        return false;
      }
    }

    static async getAllSlots(): Promise<Slot[]> {
        const result = await db.getAllAsync('SELECT * FROM slot');
        let slots: Slot[] = [];
        for (const row of result) {
            const typedRow = row as Slot;
            slots.push(new Slot( typedRow.startDate, typedRow.endDate, typedRow.startTime, typedRow.endTime, typedRow.timeZone, typedRow.breakDuration, typedRow.slotDuration, typedRow.bufferDuration,typedRow.id!));
        }
        return slots;
       
      }

      static async getSlotsByTimeZone(timeZone: string): Promise<Slot[]> {
        const result = await db.getAllAsync('SELECT * FROM slot WHERE timeZone = ?', [timeZone]);
        let slots: Slot[] = [];
        for (const row of result) { 
          const typedRow = row as Slot;
          slots.push(new Slot( typedRow.startDate, typedRow.endDate, typedRow.startTime, typedRow.endTime, typedRow.timeZone, typedRow.breakDuration, typedRow.slotDuration, typedRow.bufferDuration,typedRow.id!));

        }
        return slots;
    }
}