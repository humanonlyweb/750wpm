<script setup lang="ts">
import type { Article } from "~/types";

const INTRO_TEXT = `The art of reading quickly is not about skipping words, but training your brain to process them faster. RSVP, or Rapid Serial Visual Presentation, shows words one at a time in a fixed position. This eliminates eye movement, which typically accounts for much of reading time.
The red letter marks the Optimal Recognition Point, where your eye naturally focuses. Research shows this is typically located slightly left of center in a word, which is why the highlighting appears there.
With practice, you can dramatically increase your reading speed while maintaining comprehension. Most people read at around 200 to 300 words per minute. But with RSVP training, speeds of 500 to 800 words per minute are achievable.
Start at a comfortable pace and gradually increase until you find your optimal speed. The key is consistency. Even fifteen minutes of practice per day can lead to significant improvements within a few weeks.
Remember that comprehension matters more than raw speed. If you find yourself losing track of meaning, slow down. The goal is efficient understanding, not just fast word recognition.`;

const reader = useRsvpReader();
const { updateReadingProgress } = useDatabase();
const currentArticleId = ref<number | null>(null);

const showHeaderShortcuts = useState("showHeaderShortcuts", () => false);

watch(
  reader.hasText,
  (val) => {
    showHeaderShortcuts.value = val;
  },
  { immediate: true },
);

function loadIntroText() {
  currentArticleId.value = null;
  reader.loadText(INTRO_TEXT);
}

function handleSelectArticle(article: Article) {
  currentArticleId.value = article.id ?? null;
  reader.loadText(article.content, article.readingProgress ?? 0);
}

async function saveProgress() {
  if (currentArticleId.value && reader.currentIndex.value > 0) {
    await updateReadingProgress({
      id: currentArticleId.value,
      progress: reader.currentIndex.value,
    });
  }
}

watch(
  () => reader.isPlaying.value,
  (isPlaying, wasPlaying) => {
    if (wasPlaying && !isPlaying) {
      saveProgress();
    }
  },
);
</script>

<template>
  <div :class="[$style.pageIndex, { [$style.focusMode]: reader.isFocusMode.value }]">
    <RsvpDisplay
      :has-text="reader.hasText.value"
      :current-word="reader.currentWord.value"
      :is-playing="reader.isPlaying.value"
      :is-focus-mode="reader.isFocusMode.value"
      @load-demo="loadIntroText"
    />

    <RsvpControls
      v-if="reader.hasText.value && !reader.isFocusMode.value"
      v-model:wpm="reader.wpm.value"
      :word-count="reader.wordCount.value"
      :reading-time-seconds="reader.readingTimeSeconds.value"
      :progress="reader.progress.value"
      :is-playing="reader.isPlaying.value"
      @toggle-play="reader.togglePlay"
      @reset="reader.reset"
    />
  </div>

  <ReadingList
    v-if="!reader.isFocusMode.value"
    :selected-id="currentArticleId"
    @select="handleSelectArticle"
  />
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
