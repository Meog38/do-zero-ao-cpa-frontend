import { describe, expect, it } from "vitest";

import {
  EMPTY_PROGRESS,
  getMissionGemReward,
  getQuestionXpReward,
  parseProgress,
  PROGRESS_STORAGE_KEY,
  readProgress,
  writeProgress,
} from "@/lib/user-progress";

describe("local user progress", () => {
  it("restores valid saved progress and bounds values to the learning path", () => {
    const restored = parseProgress(JSON.stringify({
      ...EMPTY_PROGRESS,
      displayName: "Ana",
      objective: "Estudar para a CPA",
      backendLearnerId: "f917dc09-b139-4f46-b0eb-80fcf80e3043",
      xp: 860,
      lives: 8,
      completedMissionIds: [1, 1, 7],
      completedQuestionCounts: { 1: 8, 7: 2 },
      rewardedQuestionIds: ["l1-q1", "not-a-question"],
      activeMissionId: 2,
      currentQuestionIndex: 3,
    }));

    expect(restored.displayName).toBe("Ana");
    expect(restored.objective).toBe("Estudar para a CPA");
    expect(restored.backendLearnerId).toBe("f917dc09-b139-4f46-b0eb-80fcf80e3043");
    expect(restored.xp).toBe(860);
    expect(restored.lives).toBe(3);
    expect(restored.completedMissionIds).toEqual([1]);
    expect(restored.completedQuestionCounts).toEqual({ 1: 5 });
    expect(restored.rewardedQuestionIds).toEqual(["l1-q1"]);
    expect(restored.currentQuestionIndex).toBe(3);
  });

  it("falls back to a clean profile when stored data is invalid", () => {
    expect(parseProgress("not json")).toEqual(EMPTY_PROGRESS);
    expect(parseProgress(JSON.stringify({ completedMissionIds: "all" })).completedMissionIds).toEqual([]);
  });

  it("reads and writes under the versioned local key", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };
    const profile = { ...EMPTY_PROGRESS, displayName: "Bia", xp: 40 };

    expect(writeProgress(storage, profile)).toBe(true);
    expect(values.has(PROGRESS_STORAGE_KEY)).toBe(true);
    expect(readProgress(storage)).toEqual(profile);
  });

  it("only awards XP for a newly completed question and gems once per mission", () => {
    expect(getQuestionXpReward(false, false, false)).toBe(0);
    expect(getQuestionXpReward(true, false, false)).toBe(20);
    expect(getQuestionXpReward(true, true, false)).toBe(0);
    expect(getQuestionXpReward(true, false, true)).toBe(0);
    const restartedMission = { ...EMPTY_PROGRESS, completedQuestionCounts: { 1: 0 }, rewardedQuestionIds: ["l1-q1"] };
    expect(getQuestionXpReward(true, restartedMission.rewardedQuestionIds.includes("l1-q1"), false)).toBe(0);
    expect(getMissionGemReward(false)).toBe(15);
    expect(getMissionGemReward(true)).toBe(0);
  });
});