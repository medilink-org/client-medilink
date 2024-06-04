import { create } from 'zustand';

export const useStore = create((set) => ({
  username: null,
  practitionerId: null,
  updateUsername: (username) => set({ username }),
  updatePractitionerId: (practitionerId) => set({ practitionerId })
}));
