import { create } from 'zustand';

interface Zone {
  id: string;
  venueId: string;
  name: string;
  color: string;
  seatCount: number;
  priceCategory: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ZoneStore {
  zones: Zone[];
  loading: boolean;
  error: string | null;

  // Actions
  getZone: (id: string) => Promise<Zone | null>;
  getZonesByVenue: (venueId: string) => Promise<Zone[]>;
  createZone: (zone: Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Zone>;
  updateZone: (id: string, zone: Partial<Zone>) => Promise<Zone>;
  deleteZone: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useZoneStore = create<ZoneStore>((set, get) => ({
  zones: [],
  loading: false,
  error: null,

  getZone: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/admin/zones/${id}`);
      if (!response.ok) {
        throw new Error('구역을 찾을 수 없습니다.');
      }

      const zone = await response.json();
      return zone;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getZonesByVenue: async (venueId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/admin/venues/${venueId}/zones`);
      if (!response.ok) {
        throw new Error('구역 목록을 불러올 수 없습니다.');
      }

      const zones = await response.json();
      set({ zones });
      return zones;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  createZone: async (zoneData) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch('/api/admin/zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zoneData),
      });

      if (!response.ok) {
        throw new Error('구역 생성에 실패했습니다.');
      }

      const newZone = await response.json();
      set((state) => ({ zones: [...state.zones, newZone] }));
      return newZone;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateZone: async (id, zoneData) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/admin/zones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zoneData),
      });

      if (!response.ok) {
        throw new Error('구역 수정에 실패했습니다.');
      }

      const updatedZone = await response.json();
      set((state) => ({
        zones: state.zones.map((zone) => (zone.id === id ? updatedZone : zone)),
      }));
      return updatedZone;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteZone: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/admin/zones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('구역 삭제에 실패했습니다.');
      }

      set((state) => ({
        zones: state.zones.filter((zone) => zone.id !== id),
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
