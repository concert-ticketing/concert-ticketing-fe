import { create } from 'zustand';

interface Seat {
  id: string;
  zoneId: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: 'available' | 'occupied' | 'disabled';
  priceCategory: string;
  createdAt: string;
  updatedAt: string;
}

interface SeatStore {
  seats: Seat[];
  loading: boolean;
  error: string | null;
  
  // Actions
  getSeat: (id: string) => Promise<Seat | null>;
  getSeatsByZone: (zoneId: string) => Promise<Seat[]>;
  createSeat: (seat: Omit<Seat, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Seat>;
  createSeats: (seats: Omit<Seat, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<Seat[]>;
  updateSeat: (id: string, seat: Partial<Seat>) => Promise<Seat>;
  updateSeats: (updates: { id: string; data: Partial<Seat> }[]) => Promise<Seat[]>;
  deleteSeat: (id: string) => Promise<void>;
  deleteSeats: (ids: string[]) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSeatStore = create<SeatStore>((set, get) => ({
  seats: [],
  loading: false,
  error: null,

  getSeat: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/admin/seats/${id}`);
      if (!response.ok) {
        throw new Error('좌석을 찾을 수 없습니다.');
      }
      
      const seat = await response.json();
      return seat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getSeatsByZone: async (zoneId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/admin/zones/${zoneId}/seats`);
      if (!response.ok) {
        throw new Error('좌석 목록을 불러올 수 없습니다.');
      }
      
      const seats = await response.json();
      
      // 기존 좌석들과 병합
      set(state => {
        const existingSeats = state.seats.filter(seat => seat.zoneId !== zoneId);
        return { seats: [...existingSeats, ...seats] };
      });
      
      return seats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  createSeat: async (seatData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch('/api/admin/seats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seatData),
      });
      
      if (!response.ok) {
        throw new Error('좌석 생성에 실패했습니다.');
      }
      
      const newSeat = await response.json();
      set(state => ({ seats: [...state.seats, newSeat] }));
      return newSeat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createSeats: async (seatsData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch('/api/admin/seats/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seats: seatsData }),
      });
      
      if (!response.ok) {
        throw new Error('좌석 대량 생성에 실패했습니다.');
      }
      
      const newSeats = await response.json();
      set(state => ({ seats: [...state.seats, ...newSeats] }));
      return newSeats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateSeat: async (id, seatData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/admin/seats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seatData),
      });
      
      if (!response.ok) {
        throw new Error('좌석 수정에 실패했습니다.');
      }
      
      const updatedSeat = await response.json();
      set(state => ({
        seats: state.seats.map(seat => 
          seat.id === id ? updatedSeat : seat
        )
      }));
      return updatedSeat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateSeats: async (updates) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch('/api/admin/seats/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
      
      if (!response.ok) {
        throw new Error('좌석 대량 수정에 실패했습니다.');
      }
      
      const updatedSeats = await response.json();
      set(state => {
        const newSeats = [...state.seats];
        updatedSeats.forEach((updatedSeat: Seat) => {
          const index = newSeats.findIndex(seat => seat.id === updatedSeat.id);
          if (index !== -1) {
            newSeats[index] = updatedSeat;
          }
        });
        return { seats: newSeats };
      });
      return updatedSeats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteSeat: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`/api/admin/seats/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('좌석 삭제에 실패했습니다.');
      }
      
      set(state => ({
        seats: state.seats.filter(seat => seat.id !== id)
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteSeats: async (ids) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch('/api/admin/seats/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        throw new Error('좌석 대량 삭제에 실패했습니다.');
      }
      
      set(state => ({
        seats: state.seats.filter(seat => !ids.includes(seat.id))
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));