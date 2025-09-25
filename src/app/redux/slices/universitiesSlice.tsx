"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UniPick, CheckoutSummary, University } from "@/lib/uni-types";

type UniState = {
  // user’s chosen universities (max 5)
  picks: UniPick[]; 
  // in-memory cache of last-seen search results (so modal can read)
  catalog: Record<string, University>; 
};

let initialPicks: UniPick[] = [];
try {
  const raw = typeof window !== 'undefined' ? localStorage.getItem('pcas:universities:picks') : null;
  if (raw) initialPicks = JSON.parse(raw);
} catch {}

const initialState: UniState = { picks: initialPicks, catalog: {} };

const MAX_UNIS = 5;

const universitiesSlice = createSlice({
  name: "universities",
  initialState,
  reducers: {
    // Replace callers to hydrate from API results
    cacheResults(state, action: PayloadAction<University[]>) {
      for (const u of action.payload) state.catalog[u.id] = u;
    },
    addPick(state, action: PayloadAction<{ uniId: string }>) {
      if (state.picks.find(p => p.uniId === action.payload.uniId)) return;
      if (state.picks.length >= MAX_UNIS) return;
      state.picks.push({ uniId: action.payload.uniId, rankedProgramIds: [] });
    },
    removePick(state, action: PayloadAction<{ uniId: string }>) {
      state.picks = state.picks.filter(p => p.uniId !== action.payload.uniId);
    },
    setField(state, action: PayloadAction<{ uniId: string; field: string }>) {
      const p = state.picks.find(x => x.uniId === action.payload.uniId);
      if (!p) return;
      p.fieldOfStudy = action.payload.field;
      p.rankedProgramIds = []; // reset ranking when field changes
    },
    toggleRankedProgram(state, action: PayloadAction<{ uniId: string; programId: string }>) {
      const p = state.picks.find(x => x.uniId === action.payload.uniId);
      if (!p) return;
      const i = p.rankedProgramIds.indexOf(action.payload.programId);
      if (i >= 0) p.rankedProgramIds.splice(i, 1);
      else p.rankedProgramIds.push(action.payload.programId);
    },
    moveRank(state, action: PayloadAction<{ uniId: string; from: number; to: number }>) {
      const p = state.picks.find(x => x.uniId === action.payload.uniId);
      if (!p) return;
      const arr = p.rankedProgramIds;
      const [item] = arr.splice(action.payload.from, 1);
      arr.splice(action.payload.to, 0, item);
    },
    resetUniversities(state) {
      state.picks = [];
      // keep catalog cache since it mirrors recent search results; clear if needed
    },
  },
});

export const {
  cacheResults, addPick, removePick, setField, toggleRankedProgram, moveRank, resetUniversities
} = universitiesSlice.actions;

export default universitiesSlice.reducer;

/** Helpers */
export const selectPicks = (s: any) => (s.universities as UniState).picks;
export const selectCatalog = (s: any) => (s.universities as UniState).catalog;

export function canSendApplication(state: any): boolean {
  const picks = selectPicks(state);
  return picks.length > 0 && picks.every(p => p.fieldOfStudy && p.rankedProgramIds.length > 0);
}

export function buildCheckout(state: any): CheckoutSummary {
  const picks = selectPicks(state);
  const catalog = selectCatalog(state);
  const items = picks.flatMap(p => {
    const uni = catalog[p.uniId];
    const programs = uni?.programsByField[p.fieldOfStudy ?? ""] ?? [];
    return p.rankedProgramIds.map(id => {
      const pr = programs.find(x => x.id === id)!;
      return { uniId: p.uniId, programId: id, semFeePKR: pr.avgSemesterFeePKR };
    });
  });
  const totalPKR = items.reduce((n, i) => n + i.semFeePKR, 0);
  return { items, totalPKR };
}
