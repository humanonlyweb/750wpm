<script setup lang="ts">
const {
  hasText = false,
  currentWord = "",
  isFocusMode = false,
} = defineProps<{
  hasText?: boolean;
  currentWord?: string;
  isPlaying?: boolean;
  isFocusMode?: boolean;
}>();

defineEmits<{
  loadDemo: [];
}>();

function getOrpIndex(word: string): number {
  const len = word.length;
  if (len === 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return Math.floor(len * 0.3);
}

const wordParts = computed(() => {
  if (!currentWord) return null;
  const orpIndex = getOrpIndex(currentWord);
  return {
    before: currentWord.slice(0, orpIndex),
    orp: currentWord[orpIndex],
    after: currentWord.slice(orpIndex + 1),
  };
});
</script>

<template>
  <div :class="[$style.readerWrap, { [$style.empty]: !hasText, [$style.focusMode]: isFocusMode }]">
    <div :class="$style.wordDisplayWrap">
      <div v-if="!hasText" :class="$style.placeholderText">
        <p>Load an article to start reading</p>
        <p>or try</p>
        <Button size="small" outline @click="$emit('loadDemo')"> How it works </Button>
      </div>

      <div v-else-if="wordParts" :class="$style.wordDisplay" aria-live="polite" aria-atomic="true">
        <span>{{ wordParts.before }}</span>
        <span :class="$style.orp">{{ wordParts.orp }}</span>
        <span>{{ wordParts.after }}</span>
      </div>

      <div v-else :class="$style.readyText">Press <kbd>Space</kbd> or Play to start</div>
    </div>
  </div>
</template>

<style lang="scss" module>
.readerWrap {
  --_line-color: var(--accent);
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  background-color: var(--surface);
  min-height: 350px;
  border-radius: var(--radius-sm);

  @media (max-width: 480px) {
    min-height: 250px;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 1px;
    height: 10%;
    transform: translateX(-50%);
    pointer-events: none;
    background-color: var(--_line-color);
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  &.empty {
    --_line-color: var(--border);
  }

  &.focusMode {
    border: none;
    background: transparent;
    min-height: auto;
    max-width: 100%;
    width: 100%;

    &::before,
    &::after {
      display: none;
    }

    .wordDisplay {
      font-size: clamp(60px, 15vw, 120px);
    }
  }
}

.wordDisplayWrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  user-select: none;
}

.placeholderText {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

.readyText {
  font-size: 14px;
  color: var(--text-muted);
}

.wordDisplay {
  white-space: nowrap;
  font-family: var(--font-libre);
  letter-spacing: 0.02em;
  font-size: clamp(40px, 10vw, 80px);
}

.orp {
  color: var(--accent);
}
</style>
