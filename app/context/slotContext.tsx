// context/SlotContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { Slot } from '../slot/domain/slot';

type State = {
  slots: Slot[];
};

type Action =
  | { type: 'SET_SLOTS'; payload: Slot[] }
  | { type: 'ADD_SLOT'; payload: Slot };

const SlotContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: { slots: [] },
  dispatch: () => null,
});

const slotReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SLOTS':
      return { ...state, slots: action.payload };
    case 'ADD_SLOT':
      return { ...state, slots: [...state.slots, action.payload] };
    default:
      return state;
  }
};

export const SlotProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(slotReducer, { slots: [] });

  return (
    <SlotContext.Provider value={{ state, dispatch }}>
      {children}
    </SlotContext.Provider>
  );
};

export const useSlotContext = () => useContext(SlotContext);
