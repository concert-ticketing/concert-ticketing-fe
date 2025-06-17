import { create } from 'zustand';

interface Zone {
  id: string;
  name: string;
  color: string;
  seatCount: number;
  priceCategory: string;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  capacity: number;
  svgData?: string;
  zones: Zone[];
  createdAt: string;
  updatedAt: string;
}

interface VenueStore {
  venues: Venue[];
  loading: boolean;
  error: string | null;

  // Actions
  getVenue: (id: string) => Promise<Venue | null>;
  getVenues: () => Promise<Venue[]>;
  createVenue: (venue: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Venue>;
  updateVenue: (id: string, venue: Partial<Venue>) => Promise<Venue>;
  deleteVenue: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVenueStore = create<VenueStore>((set, get) => ({
  venues: [],
  loading: false,
  error: null,

  getVenue: async (id: string) => {
    try {
      set({ loading: true, error: null });

      // API 호출 시뮬레이션
      const response = await fetch(`/api/admin/venues/${id}`);
      if (!response.ok) {
        throw new Error('공연장을 찾을 수 없습니다.');
      }

      const venue = await response.json();
      return venue;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getVenues: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch('/api/admin/venues');
      if (!response.ok) {
        throw new Error('공연장 목록을 불러올 수 없습니다.');
      }

      const venues = await response.json();
      set({ venues });
      return venues;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  createVenue: async (venueData) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueData),
      });

      if (!response.ok) {
        throw new Error('공연장 생성에 실패했습니다.');
      }

      const newVenue = await response.json();
      set((state) => ({ venues: [...state.venues, newVenue] }));
      return newVenue;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateVenue: async (id, venueData) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/admin/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueData),
      });

      if (!response.ok) {
        throw new Error('공연장 수정에 실패했습니다.');
      }

      const updatedVenue = await response.json();
      set((state) => ({
        venues: state.venues.map((venue) => (venue.id === id ? updatedVenue : venue)),
      }));
      return updatedVenue;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteVenue: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/admin/venues/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('공연장 삭제에 실패했습니다.');
      }

      set((state) => ({
        venues: state.venues.filter((venue) => venue.id !== id),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
