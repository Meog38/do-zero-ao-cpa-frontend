import { GEMS_PER_COMPLETED_MISSION, LEARNING_LEVELS, STARTER_HEARTS, XP_PER_CORRECT_ANSWER } from "@/lib/learning-content";

export const PROGRESS_STORAGE_KEY = "brainvest.progress.v1";

export type UserProgress = {
  displayName: string;
  objective: string;
  backendLearnerId: string | null;
  xp: number;
  gems: number;
  lives: number;
  streak: number;
  completedMissionIds: number[];
  completedQuestionCounts: Record<number, number>;
  rewardedQuestionIds: string[];
  activeMissionId: number | null;
  currentQuestionIndex: number;
};

type ProgressStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const EMPTY_PROGRESS: UserProgress = {
  displayName: "",
  objective: "",
  backendLearnerId: null,
  xp: 0,
  gems: 0,
  lives: STARTER_HEARTS,
  streak: 0,
  completedMissionIds: [],
  completedQuestionCounts: {},
  rewardedQuestionIds: [],
  activeMissionId: null,
  currentQuestionIndex: 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonNegativeInteger(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

export function parseProgress(serialized: string | null): UserProgress {
  if (!serialized) return { ...EMPTY_PROGRESS };

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!isRecord(parsed)) return { ...EMPTY_PROGRESS };

    const validMissionIds = new Set(LEARNING_LEVELS.map((level) => level.id));
    const completedMissionIds = Array.isArray(parsed["completedMissionIds"])
      ? [...new Set(parsed["completedMissionIds"].filter((id): id is number =>
          typeof id === "number" && validMissionIds.has(id),
        ))]
      : [];
    const completedQuestionCounts: Record<number, number> = {};
    const questionIds = new Set(LEARNING_LEVELS.flatMap((level) => level.questions.map((question) => question.id)));
    const rewardedQuestionIds = Array.isArray(parsed["rewardedQuestionIds"])
      ? [...new Set(parsed["rewardedQuestionIds"].filter((id): id is string =>
          typeof id === "string" && questionIds.has(id),
        ))]
      : [];

    if (isRecord(parsed["completedQuestionCounts"])) {
      for (const [id, count] of Object.entries(parsed["completedQuestionCounts"])) {
        const missionId = Number(id);
        if (validMissionIds.has(missionId)) {
          completedQuestionCounts[missionId] = Math.min(
            LEARNING_LEVELS[missionId - 1]!.questions.length,
            nonNegativeInteger(count, 0),
          );
        }
      }
    }

    const activeMissionId = typeof parsed["activeMissionId"] === "number" && validMissionIds.has(parsed["activeMissionId"])
      ? parsed["activeMissionId"]
      : null;

    return {
      displayName: typeof parsed["displayName"] === "string" ? parsed["displayName"].slice(0, 60) : "",
      objective: typeof parsed["objective"] === "string" ? parsed["objective"].slice(0, 100) : "",
      backendLearnerId: typeof parsed["backendLearnerId"] === "string" ? parsed["backendLearnerId"] : null,
      xp: nonNegativeInteger(parsed["xp"], 0),
      gems: nonNegativeInteger(parsed["gems"], 0),
      lives: Math.min(STARTER_HEARTS, nonNegativeInteger(parsed["lives"], STARTER_HEARTS)),
      streak: nonNegativeInteger(parsed["streak"], 0),
      completedMissionIds,
      completedQuestionCounts,
      rewardedQuestionIds,
      activeMissionId,
      currentQuestionIndex: Math.min(
        activeMissionId ? LEARNING_LEVELS[activeMissionId - 1]!.questions.length - 1 : 0,
        nonNegativeInteger(parsed["currentQuestionIndex"], 0),
      ),
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function readProgress(storage: ProgressStorage): UserProgress {
  try {
    return parseProgress(storage.getItem(PROGRESS_STORAGE_KEY));
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function writeProgress(storage: ProgressStorage, progress: UserProgress): boolean {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage: ProgressStorage): boolean {
  try {
    storage.removeItem(PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getQuestionXpReward(
  isCorrect: boolean,
  questionAlreadyRewarded: boolean,
  missionAlreadyCompleted: boolean,
): number {
  return isCorrect && !questionAlreadyRewarded && !missionAlreadyCompleted
    ? XP_PER_CORRECT_ANSWER
    : 0;
}

export function getMissionGemReward(missionAlreadyCompleted: boolean): number {
  return missionAlreadyCompleted ? 0 : GEMS_PER_COMPLETED_MISSION;
}