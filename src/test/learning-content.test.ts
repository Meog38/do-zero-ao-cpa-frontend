import { describe, expect, it } from "vitest";

import { LEARNING_LEVELS } from "@/lib/learning-content";

describe("learning path", () => {
  it("builds five levels with five questions in every mission", () => {
    expect(LEARNING_LEVELS).toHaveLength(5);
    expect(LEARNING_LEVELS.map((level) => level.questions.length)).toEqual([5, 5, 5, 5, 5]);
    expect(LEARNING_LEVELS.every((level) => level.missionSummary.length > 80)).toBe(true);
  });

  it("uses unique question ids and gives every question a valid answer and feedback", () => {
    const questions = LEARNING_LEVELS.flatMap((level) => level.questions);
    const ids = questions.map((question) => question.id);

    expect(new Set(ids).size).toBe(questions.length);
    for (const question of questions) {
      expect(question.options).toHaveLength(3);
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
      expect(question.correctFeedback.length).toBeGreaterThan(0);
      expect(question.incorrectFeedback.length).toBeGreaterThan(0);
    }
  });

  it("varies the position of the correct answer in every mission", () => {
    for (const level of LEARNING_LEVELS) {
      expect(new Set(level.questions.map((question) => question.correctOptionId)).size).toBe(3);
    }
  });

  it("moves from everyday scenarios to technical certification-style cases", () => {
    expect(LEARNING_LEVELS[0]?.missionTitle).toContain("primeiro salário");
    expect(LEARNING_LEVELS[4]?.title).toBe("Desafio CPA");
    expect(
      LEARNING_LEVELS[4]?.questions.every((question) =>
        question.context.startsWith("Caso integrado"),
      ),
    ).toBe(true);
  });
});
