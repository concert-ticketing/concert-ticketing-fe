import { create } from 'zustand';

type DateState = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
};

export const useDateStore = create<DateState>((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
