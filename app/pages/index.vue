<script setup lang="ts">
import type { Article, ReadingMode } from "~/types";

const INTRO_RSVP = `The art of reading quickly is not about skipping words, but training your brain to process them faster. RSVP, or Rapid Serial Visual Presentation, shows words one at a time in a fixed position. This eliminates eye movement, which typically accounts for much of reading time.

The red letter marks the Optimal Recognition Point, where your eye naturally focuses. Research shows this is typically located slightly left of center in a word, which is why the highlighting appears there.

With practice, you can dramatically increase your reading speed while maintaining comprehension. Most people read at around 200 to 300 words per minute. But with RSVP training, speeds of 500 to 800 words per minute are achievable.

Start at a comfortable pace and gradually increase until you find your optimal speed. The key is consistency. Even fifteen minutes of practice per day can lead to significant improvements within a few weeks.

Remember that comprehension matters more than raw speed. If you find yourself losing track of meaning, slow down. The goal is efficient understanding, not just fast word recognition.`;

const INTRO_BIONIC = `Bionic Reading is a method that guides your eyes through text by highlighting the initial letters of each word. Your brain completes the rest, allowing for faster and more focused reading.

The bolded portions act as fixation points. Instead of reading every letter, your eye jumps from anchor to anchor while your mind fills in the gaps. This leverages how your brain already processes familiar words.

Adjust the fixation percentage to find your sweet spot. A higher percentage bolds more of each word, which can help with unfamiliar text or when you want more guidance. A lower percentage is faster but requires more mental completion.

Bionic Reading works especially well for skimming articles, reading on screens, and reducing eye fatigue during long reading sessions. Many readers find it particularly helpful in light mode.

Try loading an article from your reading list or importing a file. Use the arrow keys to scroll, or Home and End to jump to the top or bottom.`;

const {
  readingTimeSeconds,
  currentIndex,
  isFocusMode,
  currentWord,
  isPlaying,
  wordCount,
  hasText,
  wpm,
  pause,
  reset,
  loadText,
  togglePlay,
} = useRsvpReader();

const {
  hasText: bionicHasText,
  setFixationPercent: bionicSetFixationPercent,
  loadText: bionicLoadText,
  bionicParagraphs,
  wordCount: bionicWordCount,
} = useBionicReader();

const { readingMode, setReadingMode, fixationPercent, setFixationPercent } = useReadingMode();
const { updateReadingProgress } = useDatabase();

const currentArticleId = ref<number | null>(null);
const showHeaderShortcuts = useState("showHeaderShortcuts", () => false);

const displayHasText = computed(() =>
  readingMode.value === "rsvp" ? hasText.value : bionicHasText.value,
);

watch(
  hasText,
  (val) => {
    showHeaderShortcuts.value = val;
  },
  { immediate: true },
);

watch(
  fixationPercent,
  (val) => {
    bionicSetFixationPercent(val);
  },
  { immediate: true },
);

function loadIntroText() {
  currentArticleId.value = null;
  loadText(INTRO_RSVP);
  bionicLoadText(INTRO_BIONIC);
}

function handleSelectArticle(article: Article) {
  currentArticleId.value = article.id ?? null;
  loadText(article.content, article.readingProgress ?? 0);
  bionicLoadText(article.content);
}

function handleModeChange(mode: ReadingMode) {
  if (isPlaying.value) {
    pause();
  }
  setReadingMode(mode);
}

async function saveProgress() {
  if (currentArticleId.value && currentIndex.value > 0) {
    await updateReadingProgress({
      id: currentArticleId.value,
      progress: currentIndex.value,
    });
  }
}

watch(
  () => isPlaying.value,
  (isPlaying, wasPlaying) => {
    if (wasPlaying && !isPlaying) {
      saveProgress();
    }
  },
);
</script>

<template>
  <div :class="[$style.pageIndex, { [$style.focusMode]: isFocusMode }]">
    <ReadingModeToggle v-if="!isFocusMode" :mode="readingMode" @update:mode="handleModeChange" />

    <template v-if="readingMode === 'rsvp'">
      <RsvpDisplay
        :has-text="displayHasText"
        :current-word="currentWord"
        :is-playing="isPlaying"
        :is-focus-mode="isFocusMode"
        @load-demo="loadIntroText"
      />

      <RsvpControls
        v-if="displayHasText && !isFocusMode"
        v-model:wpm="wpm"
        :word-count="wordCount"
        :reading-time-seconds="readingTimeSeconds"
        :progress="currentIndex"
        :is-playing="isPlaying"
        @toggle-play="togglePlay"
        @reset="reset"
      />
    </template>

    <template v-else>
      <BionicDisplay
        :has-text="bionicHasText"
        :paragraphs="bionicParagraphs"
        @load-demo="loadIntroText"
      />

      <BionicControls
        v-if="bionicHasText"
        :fixation-percent="fixationPercent"
        :word-count="bionicWordCount"
        @update:fixation-percent="setFixationPercent"
      />
    </template>
  </div>

  <ReadingList v-if="!isFocusMode" :selected-id="currentArticleId" @select="handleSelectArticle" />
</template>

<style lang="scss" module>
.pageIndex {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  &.focusMode {
    position: fixed;
    inset: 0;
    z-index: 100;
    margin: 0;
    padding: 20px;
    background-color: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
