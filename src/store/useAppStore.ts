import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultServices, type Service } from "../data/services";
import { defaultBusinessHours, type DayHours, type Weekday } from "../data/business";
import { sha256Hex } from "../utils/hash";

export interface Appointment {
  id: string;
  serviceId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  clientName: string;
  clientPhone: string;
  notes?: string;
  createdAt: string;
  status: "confirmado" | "cancelado";
}

export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

export interface BlockedRange {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

const DEFAULT_ADMIN_PASSWORD = "rosely2026";

interface AppState {
  services: Service[];
  businessHours: Record<Weekday, DayHours>;
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  blockedRanges: BlockedRange[];
  adminPasswordHash: string | null;
  isAdminAuthenticated: boolean;

  ensureAdminSeeded: () => Promise<void>;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;

  addAppointment: (a: Omit<Appointment, "id" | "createdAt" | "status">) => Appointment;
  cancelAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;

  addBlockedDate: (date: string, reason?: string) => void;
  removeBlockedDate: (id: string) => void;

  addBlockedRange: (range: Omit<BlockedRange, "id">) => void;
  removeBlockedRange: (id: string) => void;

  updateBusinessHours: (weekday: Weekday, hours: DayHours) => void;

  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;
}

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      services: defaultServices,
      businessHours: defaultBusinessHours,
      appointments: [],
      blockedDates: [],
      blockedRanges: [],
      adminPasswordHash: null,
      isAdminAuthenticated: false,

      ensureAdminSeeded: async () => {
        if (!get().adminPasswordHash) {
          const hash = await sha256Hex(DEFAULT_ADMIN_PASSWORD);
          set({ adminPasswordHash: hash });
        }
      },

      login: async (password: string) => {
        await get().ensureAdminSeeded();
        const hash = await sha256Hex(password);
        const ok = hash === get().adminPasswordHash;
        if (ok) set({ isAdminAuthenticated: true });
        return ok;
      },

      logout: () => set({ isAdminAuthenticated: false }),

      changePassword: async (currentPassword, newPassword) => {
        const currentHash = await sha256Hex(currentPassword);
        if (currentHash !== get().adminPasswordHash) return false;
        const newHash = await sha256Hex(newPassword);
        set({ adminPasswordHash: newHash });
        return true;
      },

      addAppointment: (a) => {
        const appointment: Appointment = {
          ...a,
          id: genId(),
          createdAt: new Date().toISOString(),
          status: "confirmado",
        };
        set((state) => ({ appointments: [...state.appointments, appointment] }));
        return appointment;
      },

      cancelAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status: "cancelado" } : a
          ),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      addBlockedDate: (date, reason) =>
        set((state) => ({
          blockedDates: [...state.blockedDates, { id: genId(), date, reason }],
        })),

      removeBlockedDate: (id) =>
        set((state) => ({
          blockedDates: state.blockedDates.filter((b) => b.id !== id),
        })),

      addBlockedRange: (range) =>
        set((state) => ({
          blockedRanges: [...state.blockedRanges, { ...range, id: genId() }],
        })),

      removeBlockedRange: (id) =>
        set((state) => ({
          blockedRanges: state.blockedRanges.filter((b) => b.id !== id),
        })),

      updateBusinessHours: (weekday, hours) =>
        set((state) => ({
          businessHours: { ...state.businessHours, [weekday]: hours },
        })),

      addService: (service) =>
        set((state) => ({
          services: [...state.services, { ...service, id: genId() }],
        })),

      updateService: (id, patch) =>
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      removeService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),
    }),
    {
      name: "studio-rosely-lebarch-store",
      partialize: (state) => ({
        services: state.services,
        businessHours: state.businessHours,
        appointments: state.appointments,
        blockedDates: state.blockedDates,
        blockedRanges: state.blockedRanges,
        adminPasswordHash: state.adminPasswordHash,
      }),
    }
  )
);
