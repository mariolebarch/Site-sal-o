import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import type { DayHours, Weekday } from "../data/business";
import { defaultBusinessHours } from "../data/business";
import type { Service } from "../data/services";

export interface Appointment {
  id: string;
  serviceIds: string[];
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

interface ActionResult {
  ok: boolean;
  error?: string;
}

interface AppState {
  services: Service[];
  businessHours: Record<Weekday, DayHours>;
  blockedDates: BlockedDate[];
  blockedRanges: BlockedRange[];
  appointments: Appointment[]; // populada apenas quando autenticado (admin)

  loading: boolean;
  ready: boolean;
  isAdminAuthenticated: boolean;

  init: () => Promise<void>;

  login: (email: string, password: string) => Promise<ActionResult>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<ActionResult>;

  addAppointment: (
    a: Omit<Appointment, "id" | "createdAt" | "status">
  ) => Promise<ActionResult & { appointment?: Appointment }>;
  cancelAppointment: (id: string) => Promise<ActionResult>;
  deleteAppointment: (id: string) => Promise<ActionResult>;
  fetchAppointments: () => Promise<void>;

  addBlockedDate: (date: string, reason?: string) => Promise<ActionResult>;
  removeBlockedDate: (id: string) => Promise<ActionResult>;

  addBlockedRange: (range: Omit<BlockedRange, "id">) => Promise<ActionResult>;
  removeBlockedRange: (id: string) => Promise<ActionResult>;

  updateBusinessHours: (weekday: Weekday, hours: DayHours) => Promise<ActionResult>;

  addService: (service: Omit<Service, "id"> & { id?: string }) => Promise<ActionResult>;
  updateService: (id: string, patch: Partial<Service>) => Promise<ActionResult>;
  removeService: (id: string) => Promise<ActionResult>;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `servico-${Date.now()}`
  );
}

function mapServiceRow(row: any): Service {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    durationMin: row.duration_min,
    price: Number(row.price),
    active: row.active,
  };
}

function mapAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    serviceIds: row.service_ids ?? (row.service_id ? [row.service_id] : []),
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    status: row.status,
  };
}

function mapBlockedDateRow(row: any): BlockedDate {
  return { id: row.id, date: row.date, reason: row.reason ?? undefined };
}

function mapBlockedRangeRow(row: any): BlockedRange {
  return {
    id: row.id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    reason: row.reason ?? undefined,
  };
}

export const useAppStore = create<AppState>()((set, get) => ({
  services: [],
  businessHours: defaultBusinessHours,
  blockedDates: [],
  blockedRanges: [],
  appointments: [],
  loading: false,
  ready: false,
  isAdminAuthenticated: false,

  init: async () => {
    if (get().ready) return;
    set({ loading: true });

    const [servicesRes, settingsRes, blockedDatesRes, blockedRangesRes, sessionRes] =
      await Promise.all([
        supabase.from("services").select("*").order("category_id"),
        supabase.from("app_settings").select("*").eq("id", "main").maybeSingle(),
        supabase.from("blocked_dates").select("*"),
        supabase.from("blocked_ranges").select("*"),
        supabase.auth.getSession(),
      ]);

    set({
      services: (servicesRes.data ?? []).map(mapServiceRow),
      businessHours: settingsRes.data?.business_hours ?? defaultBusinessHours,
      blockedDates: (blockedDatesRes.data ?? []).map(mapBlockedDateRow),
      blockedRanges: (blockedRangesRes.data ?? []).map(mapBlockedRangeRow),
      isAdminAuthenticated: !!sessionRes.data.session,
      loading: false,
      ready: true,
    });

    if (sessionRes.data.session) {
      get().fetchAppointments();
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isAdminAuthenticated: !!session });
      if (session) {
        get().fetchAppointments();
      } else {
        set({ appointments: [] });
      }
    });
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    set({ isAdminAuthenticated: true });
    await get().fetchAppointments();
    return { ok: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAdminAuthenticated: false, appointments: [] });
  },

  changePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  fetchAppointments: async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });
    if (!error) {
      set({ appointments: (data ?? []).map(mapAppointmentRow) });
    }
  },

  addAppointment: async (a) => {
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        service_ids: a.serviceIds,
        date: a.date,
        start_time: a.startTime,
        end_time: a.endTime,
        client_name: a.clientName,
        client_phone: a.clientPhone,
        notes: a.notes ?? null,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    const appointment = mapAppointmentRow(data);
    if (get().isAdminAuthenticated) {
      set((s) => ({ appointments: [...s.appointments, appointment] }));
    }
    return { ok: true, appointment };
  },

  cancelAppointment: async (id) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelado" })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    set((s) => ({
      appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a)),
    }));
    return { ok: true };
  },

  deleteAppointment: async (id) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) }));
    return { ok: true };
  },

  addBlockedDate: async (date, reason) => {
    const { data, error } = await supabase
      .from("blocked_dates")
      .insert({ date, reason: reason ?? null })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ blockedDates: [...s.blockedDates, mapBlockedDateRow(data)] }));
    return { ok: true };
  },

  removeBlockedDate: async (id) => {
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    set((s) => ({ blockedDates: s.blockedDates.filter((b) => b.id !== id) }));
    return { ok: true };
  },

  addBlockedRange: async (range) => {
    const { data, error } = await supabase
      .from("blocked_ranges")
      .insert({
        date: range.date,
        start_time: range.startTime,
        end_time: range.endTime,
        reason: range.reason ?? null,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ blockedRanges: [...s.blockedRanges, mapBlockedRangeRow(data)] }));
    return { ok: true };
  },

  removeBlockedRange: async (id) => {
    const { error } = await supabase.from("blocked_ranges").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    set((s) => ({ blockedRanges: s.blockedRanges.filter((b) => b.id !== id) }));
    return { ok: true };
  },

  updateBusinessHours: async (weekday, hours) => {
    const nextHours = { ...get().businessHours, [weekday]: hours };
    const { error } = await supabase
      .from("app_settings")
      .update({ business_hours: nextHours })
      .eq("id", "main");
    if (error) return { ok: false, error: error.message };
    set({ businessHours: nextHours });
    return { ok: true };
  },

  addService: async (service) => {
    const id = service.id ?? slugify(service.name);
    const { data, error } = await supabase
      .from("services")
      .insert({
        id,
        category_id: service.categoryId,
        name: service.name,
        description: service.description,
        duration_min: service.durationMin,
        price: service.price,
        active: service.active,
      })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ services: [...s.services, mapServiceRow(data)] }));
    return { ok: true };
  },

  updateService: async (id, patch) => {
    const payload: Record<string, unknown> = {};
    if (patch.categoryId !== undefined) payload.category_id = patch.categoryId;
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.description !== undefined) payload.description = patch.description;
    if (patch.durationMin !== undefined) payload.duration_min = patch.durationMin;
    if (patch.price !== undefined) payload.price = patch.price;
    if (patch.active !== undefined) payload.active = patch.active;

    const { data, error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    set((s) => ({ services: s.services.map((sv) => (sv.id === id ? mapServiceRow(data) : sv)) }));
    return { ok: true };
  },

  removeService: async (id) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    set((s) => ({ services: s.services.filter((sv) => sv.id !== id) }));
    return { ok: true };
  },
}));
