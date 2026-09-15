import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  // Theme preference
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  // Current profile information (shared between Navbar and Profile page)
  displayName: "Mariam Mohamed",
  setDisplayName: (name) => set({ displayName: name }),

  // Favorite doctors (array of doctor ids)
  favoriteDoctorIds: [],
  toggleFavoriteDoctor: (doctorId) =>
    set((state) => {
      const isFavorite = state.favoriteDoctorIds.includes(doctorId);
      return {
        favoriteDoctorIds: isFavorite
          ? state.favoriteDoctorIds.filter((id) => id !== doctorId)
          : [...state.favoriteDoctorIds, doctorId],
      };
    }),
  isFavoriteDoctor: (doctorId) => get().favoriteDoctorIds.includes(doctorId),
  clearFavorites: () => set({ favoriteDoctorIds: [] }),

  // Shared doctor list filters (used by DoctorsPage)
  specialtyFilter: "All",
  setSpecialtyFilter: (specialty) => set({ specialtyFilter: specialty }),
}));
