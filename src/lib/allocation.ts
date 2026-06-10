import type { Allocation, AssetId } from "./types";

const ASSETS: AssetId[] = ["USDY", "METH", "MNT"];
const MIN_PCT = 5;
const MAX_PCT = 85;

export function redistributeAllocation(
  current: Allocation,
  changedAsset: AssetId,
  newValue: number
): Allocation {
  const clamped = Math.max(MIN_PCT, Math.min(MAX_PCT, newValue));
  const others = ASSETS.filter((a) => a !== changedAsset);
  const remaining = 100 - clamped;
  const [o1, o2] = others;
  const otherSum = current[o1] + current[o2];

  let v1: number;
  let v2: number;

  if (otherSum <= 0) {
    v1 = Math.floor(remaining / 2);
    v2 = remaining - v1;
  } else {
    v1 = Math.round((remaining * current[o1]) / otherSum);
    v2 = remaining - v1;
  }

  if (v1 < MIN_PCT) {
    v1 = MIN_PCT;
    v2 = remaining - MIN_PCT;
  }
  if (v2 < MIN_PCT) {
    v2 = MIN_PCT;
    v1 = remaining - MIN_PCT;
  }

  if (v1 < MIN_PCT || v2 < MIN_PCT) {
    return { USDY: 34, METH: 33, MNT: 33 };
  }

  return {
    ...current,
    [changedAsset]: clamped,
    [o1]: v1,
    [o2]: v2,
  };
}