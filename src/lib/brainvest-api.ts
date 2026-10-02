export type ApiOption = { id: string; text: string };

export type ApiQuestion = {
  id: string;
  context: string;
  prompt: string;
  concept: string;
  options: ApiOption[];
};

export type ApiLevel = {
  id: number;
  title: string;
  emoji: string;
  tone: "mint" | "coral" | "butter" | "ink";
  description: string;
  missionTitle: string;
  missionBrief: string;
  questions: ApiQuestion[];
};

export type ApiCurriculum = { version: number; levels: ApiLevel[] };

export type ApiLearner = {
  id: string;
  displayName: string;
  objective: string;
  xp: number;
  gems: number;
  lives: number;
  streak: number;
  activeLevelId: number;
  currentQuestionIndex: number;
};

export type ApiProgress = Omit<ApiLearner, "id"> & {
  learnerId: string;
  completedMissionIds: number[];
  completedQuestionCounts: Record<number, number>;
  rewardedQuestionIds: string[];
};

export type ApiAnswer = {
  questionId: string;
  correct: boolean;
  concept: string;
  feedback: string;
  xpAwarded: number;
  gemsAwarded: number;
  lives: number;
  streak: number;
  completedQuestionCount: number;
  missionCompleted: boolean;
  rewardsAlreadyClaimed: boolean;
};

type ApiErrorBody = { code?: string; message?: string };

// Base da API fixa no código; VITE_API_BASE_URL, se definida no build, tem prioridade.
const defaultBaseUrl = "https://3-221-155-116.sslip.io";
const configuredBaseUrl = (import.meta.env["VITE_API_BASE_URL"]?.trim() || defaultBaseUrl).replace(/\/+$/, "");

export const isApiConfigured = true;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!configuredBaseUrl) throw new Error("VITE_API_BASE_URL is not configured.");

  let response: Response;
  try {
    response = await fetch(`${configuredBaseUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se o backend está em execução.");
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(error.message ?? `A API respondeu com status ${response.status}.`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getCurriculum() {
  return request<ApiCurriculum>("/api/v1/curriculum");
}

export function createLearner(displayName: string, objective: string) {
  return request<ApiLearner>("/api/v1/learners", {
    method: "POST",
    body: JSON.stringify({ displayName, objective }),
  });
}

export function getLearnerProgress(learnerId: string) {
  return request<ApiProgress>(`/api/v1/learners/${encodeURIComponent(learnerId)}/progress`);
}

export function updateLearnerProfile(learnerId: string, displayName: string, objective: string) {
  return request<ApiLearner>(`/api/v1/learners/${encodeURIComponent(learnerId)}/profile`, {
    method: "PATCH",
    body: JSON.stringify({ displayName, objective }),
  });
}

export function submitLearnerAnswer(learnerId: string, questionId: string, selectedOptionId: string, requestId: string) {
  return request<ApiAnswer>(`/api/v1/learners/${encodeURIComponent(learnerId)}/answers`, {
    method: "POST",
    body: JSON.stringify({ requestId, questionId, selectedOptionId }),
  });
}

export function restartLearnerMission(learnerId: string, levelId: number) {
  return request<{ activeLevelId: number; currentQuestionIndex: number; lives: number; streak: number }>(
    `/api/v1/learners/${encodeURIComponent(learnerId)}/missions/${levelId}/restart`,
    { method: "POST" },
  );
}

export function deleteLearnerProfile(learnerId: string) {
  return request<void>(`/api/v1/learners/${encodeURIComponent(learnerId)}`, { method: "DELETE" });
}