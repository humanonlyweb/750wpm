<script setup lang="ts">
useSeoMeta({
  title: "Speed Reading Test - What's Your WPM?",
  ogTitle: "Speed Reading Test - What's Your WPM?",
  description:
    "Take a free speed reading test. Read a passage, answer comprehension questions, and find out how your reading speed compares to others.",
  ogDescription:
    "Take a free speed reading test. Read a passage, answer comprehension questions, and find out how your reading speed compares to others.",
});

const {
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
} = useSpeedTest();

const shareText = computed(() => {
  if (!result.value) return "";
  return `I read at ${result.value.wpm} WPM with ${result.value.comprehension}% comprehension — faster than ${result.value.percentile}% of readers. Test yours:`;
});

const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

async function shareResult() {
  const text = shareText.value;
  const url = window.location.href;
  if (navigator.share) {
    await navigator.share({ text, url }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(`${text} ${url}`);
    if (copiedTimer) clearTimeout(copiedTimer);
    copied.value = true;
    copiedTimer = setTimeout(() => {
      copied.value = false;
      copiedTimer = null;
    }, 2000);
  }
}
</script>

<template>
  <div :class="$style.testPage">
    <!-- Intro -->
    <div v-if="phase === 'intro'" :class="$style.intro">
      <h1 :class="$style.title">Speed Reading Test</h1>
      <p :class="$style.subtitle">
        Measure your reading speed and comprehension. You'll read a short passage, then answer five
        questions about what you read.
      </p>

      <div :class="$style.instructions">
        <div :class="$style.step">
          <span :class="$style.stepNum">1</span>
          <span>Read the passage at your natural pace</span>
        </div>
        <div :class="$style.step">
          <span :class="$style.stepNum">2</span>
          <span>Click "Done Reading" when you finish</span>
        </div>
        <div :class="$style.step">
          <span :class="$style.stepNum">3</span>
          <span>Answer comprehension questions</span>
        </div>
        <div :class="$style.step">
          <span :class="$style.stepNum">4</span>
          <span>Get your WPM score and percentile</span>
        </div>
      </div>

      <Button variant="primary" size="normal" @click="startTest">Start Test</Button>
    </div>

    <!-- Reading -->
    <div v-else-if="phase === 'reading'" :class="$style.reading">
      <div :class="$style.readingHeader">
        <span :class="$style.readingLabel">Reading...</span>
        <span :class="$style.wordCountBadge">{{ passage.wordCount }} words</span>
      </div>

      <article :class="$style.passage">
        <p v-for="(paragraph, i) in passage.text.split('\n\n')" :key="i" :class="$style.paragraph">
          {{ paragraph }}
        </p>
      </article>

      <div :class="$style.doneBar">
        <Button variant="primary" size="normal" @click="finishReading">Done Reading</Button>
      </div>
    </div>

    <!-- Questions -->
    <div v-else-if="phase === 'questions'" :class="$style.questions">
      <h2 :class="$style.questionsTitle">Comprehension Check</h2>
      <p :class="$style.questionsSubtitle">
        Answer these questions about the passage you just read.
      </p>

      <div v-for="(q, qi) in passage.questions" :key="qi" :class="$style.questionBlock">
        <p :class="$style.questionText">{{ qi + 1 }}. {{ q.question }}</p>
        <div :class="$style.options">
          <label
            v-for="(option, oi) in q.options"
            :key="oi"
            :class="[$style.option, { [$style.selected]: answers[qi] === oi }]"
          >
            <input
              type="radio"
              :name="`q-${qi}`"
              :value="oi"
              :checked="answers[qi] === oi"
              :class="$style.radio"
              @change="selectAnswer({ questionIndex: qi, optionIndex: oi })"
            />
            <span :class="$style.optionIndicator">{{ String.fromCharCode(65 + oi) }}</span>
            <span>{{ option }}</span>
          </label>
        </div>
      </div>

      <Button variant="primary" size="normal" :disabled="!allAnswered" @click="submitAnswers">
        See Results
      </Button>
    </div>

    <!-- Results -->
    <div v-else-if="phase === 'results' && result" :class="$style.results">
      <h2 :class="$style.resultsTitle">Your Results</h2>

      <div :class="$style.scoreCards">
        <div :class="$style.scoreCard">
          <span :class="$style.scoreValue">{{ result.wpm }}</span>
          <span :class="$style.scoreLabel">Words per Minute</span>
        </div>
        <div :class="$style.scoreCard">
          <span :class="$style.scoreValue">{{ result.comprehension }}%</span>
          <span :class="$style.scoreLabel">Comprehension</span>
        </div>
      </div>

      <div :class="$style.meta">
        <div :class="$style.metaItem">
          <span :class="$style.metaLabel">Speed Rating</span>
          <span :class="$style.metaValue">{{ result.speedLabel }}</span>
        </div>
        <div :class="$style.metaItem">
          <span :class="$style.metaLabel">Faster Than</span>
          <span :class="$style.metaValue">{{ result.percentile }}% of readers</span>
        </div>
        <div :class="$style.metaItem">
          <span :class="$style.metaLabel">Reading Time</span>
          <span :class="$style.metaValue">{{ Math.round(result.readingTimeSeconds) }}s</span>
        </div>
        <div :class="$style.metaItem">
          <span :class="$style.metaLabel">Correct Answers</span>
          <span :class="$style.metaValue"
            >{{ result.correctAnswers }}/{{ result.totalQuestions }}</span
          >
        </div>
      </div>

      <div :class="$style.percentileBar">
        <div :class="$style.percentileTrack">
          <div :class="$style.percentileFill" :style="{ width: `${result.percentile}%` }" />
          <span :class="$style.percentileMarker" :style="{ left: `${result.percentile}%` }">
            You
          </span>
        </div>
        <div :class="$style.percentileLabels">
          <span>Slower</span>
          <span>Faster</span>
        </div>
      </div>

      <div :class="$style.resultActions">
        <Button variant="primary" size="normal" @click="retake">Take Again</Button>
        <Button variant="secondary" outline size="normal" @click="shareResult">
          {{ copied ? "Copied!" : "Share Result" }}
        </Button>
        <Button variant="secondary" outline size="normal" to="/">Train with 750wpm</Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.testPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 40px;
}

/* Intro */
.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  max-width: 520px;
}

.title {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 20px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.stepNum {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-full);
}

/* Reading */
.reading {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 680px;
  width: 100%;
}

.readingHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.readingLabel {
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
}

.wordCountBadge {
  font-size: 11px;
  color: var(--text-muted);
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
}

.passage {
  padding: 16px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-libre);
  font-size: clamp(15px, 2vw, 17px);
  line-height: 1.8;
  color: var(--text);

  @media (min-width: 480px) {
    padding: 28px;
  }
}

.paragraph {
  max-width: none;

  & + & {
    margin-top: 20px;
  }
}

.doneBar {
  display: flex;
  justify-content: center;
}

/* Questions */
.questions {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  width: 100%;
}

.questionsTitle {
  font-size: 22px;
  font-weight: 600;
}

.questionsSubtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: -12px;
}

.questionBlock {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.questionText {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.4;
  -webkit-tap-highlight-color: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    background-color var(--transition-default),
    border-color var(--transition-default);

  @media (hover: hover) {
    &:hover {
      background-color: oklch(from var(--border) l c h / 0.3);
    }
  }

  &.selected {
    border-color: var(--accent);
    background-color: oklch(from var(--accent) l c h / 0.08);
  }
}

.radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.optionIndicator {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  transition:
    background-color var(--transition-default),
    border-color var(--transition-default),
    color var(--transition-default);

  .selected & {
    border-color: var(--accent);
    background-color: var(--accent);
    color: white;
  }
}

/* Results */
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  max-width: 520px;
  width: 100%;
}

.resultsTitle {
  font-size: 22px;
  font-weight: 600;
}

.scoreCards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.scoreCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 16px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.scoreValue {
  font-family: var(--font-libre);
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 700;
  color: var(--accent);
}

.scoreLabel {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  width: 100%;
  background-color: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.metaItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background-color: var(--surface);
}

.metaLabel {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metaValue {
  font-size: 14px;
  font-weight: 500;
}

.percentileBar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.percentileTrack {
  position: relative;
  height: 8px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  overflow: visible;
}

.percentileFill {
  height: 100%;
  background-color: var(--accent);
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.percentileMarker {
  position: absolute;
  top: -26px;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  transition: left 0.6s ease;
}

.percentileLabels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
}

.resultActions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
  }
}
</style>
