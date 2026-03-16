import {
  getRandomPassage,
  getPercentile,
  getSpeedLabel,
  type TestPassage,
} from "~/data/test-passages";

export type TestPhase = "intro" | "reading" | "questions" | "results";

export interface TestResult {
  wpm: number;
  comprehension: number;
  percentile: number;
  speedLabel: string;
  correctAnswers: number;
  totalQuestions: number;
  readingTimeSeconds: number;
  passage: TestPassage;
}

export function useSpeedTest() {
  const phase = ref<TestPhase>("intro");
  const passage = ref<TestPassage>(getRandomPassage());
  const startTime = ref<number>(0);
  const endTime = ref<number>(0);
  const answers = ref<(number | null)[]>([]);
  const result = ref<TestResult | null>(null);

  function startTest() {
    passage.value = getRandomPassage();
    answers.value = new Array(passage.value.questions.length).fill(null);
    result.value = null;
    phase.value = "reading";
    startTime.value = Date.now();
  }

  function finishReading() {
    endTime.value = Date.now();
    phase.value = "questions";
  }

  function selectAnswer({
    questionIndex,
    optionIndex,
  }: {
    questionIndex: number;
    optionIndex: number;
  }) {
    answers.value[questionIndex] = optionIndex;
  }

  function submitAnswers() {
    const questions = passage.value.questions;
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers.value[i] === questions[i]?.correctIndex) {
        correct++;
      }
    }

    const readingTimeSeconds = (endTime.value - startTime.value) / 1000;
    const readingTimeMinutes = readingTimeSeconds / 60;
    const wpm = Math.round(passage.value.wordCount / readingTimeMinutes);
    const comprehension = Math.round((correct / questions.length) * 100);

    result.value = {
      wpm,
      comprehension,
      percentile: getPercentile(wpm),
      speedLabel: getSpeedLabel(wpm),
      correctAnswers: correct,
      totalQuestions: questions.length,
      readingTimeSeconds,
      passage: passage.value,
    };

    phase.value = "results";
  }

  function retake() {
    phase.value = "intro";
    result.value = null;
  }

  const allAnswered = computed(() => answers.value.every((a) => a !== null));

  return {
    phase,
    passage,
    answers,
    result,
    allAnswered,
    startTest,
    finishReading,
    selectAnswer,
    submitAnswers,
    retake,
  };
}
