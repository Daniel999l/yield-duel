"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { redistributeAllocation } from "@/lib/allocation";
import type { Allocation, DuelRound, OnChainLogEntry } from "@/lib/types";

interface DuelState {
  humanAllocation: Allocation;
  rounds: DuelRound[];
  logs: OnChainLogEntry[];
  wins: number;
  losses: number;
  streak: number;
  isDueling: boolean;
  lastRound: DuelRound | null;
  setAllocation: (asset: keyof Allocation, value: number) => void;
  setHumanAllocation: (allocation: Allocation) => void;
  startDuel: () => void;
  finishDuel: (round: DuelRound, log: OnChainLogEntry[]) => void;
  resetStreak: () => void;
}

const DEFAULT_ALLOCATION: Allocation = { USDY: 40, METH: 35, MNT: 25 };

export const useDuelStore = create<DuelState>()(
  persist(
    (set, get) => ({
      humanAllocation: DEFAULT_ALLOCATION,
      rounds: [],
      logs: [],
      wins: 0,
      losses: 0,
      streak: 0,
      isDueling: false,
      lastRound: null,

      setAllocation: (asset, value) => {
        set({
          humanAllocation: redistributeAllocation(get().humanAllocation, asset, value),
        });
      },

      setHumanAllocation: (allocation) => set({ humanAllocation: allocation }),

      startDuel: () => set({ isDueling: true, lastRound: null }),

      finishDuel: (round, newLogs) => {
        const prev = get();
        const won = round.winner === "human";
        const lost = round.winner === "agent";

        set({
          isDueling: false,
          lastRound: round,
          rounds: [round, ...prev.rounds].slice(0, 20),
          logs: [...newLogs, ...prev.logs].slice(0, 50),
          wins: prev.wins + (won ? 1 : 0),
          losses: prev.losses + (lost ? 1 : 0),
          streak: won ? prev.streak + 1 : lost ? 0 : prev.streak,
        });
      },

      resetStreak: () => set({ streak: 0, wins: 0, losses: 0, rounds: [], logs: [] }),
    }),
    { name: "yield-duel-state" }
  )
);