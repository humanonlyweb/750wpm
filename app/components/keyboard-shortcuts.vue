<script setup lang="ts">
const reader = useRsvpReader();
const bionicReader = useBionicReader();
const { readingMode, toggleReadingMode } = useReadingMode();

const SCROLL_AMOUNT = 100;

function handleKeydown(e: KeyboardEvent) {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    (e.target as HTMLElement).closest("dialog[open]")
  ) {
    return;
  }

  const isRsvpMode = readingMode.value === "rsvp";
  const isBionicMode = readingMode.value === "bionic";

  switch (e.code) {
    case "KeyM":
      toggleReadingMode();
      break;
    case "Space":
      if (isRsvpMode) {
        e.preventDefault();
        if (reader.hasText.value) {
          reader.togglePlay();
        }
      }
      break;
    case "KeyR":
      if (isRsvpMode && reader.hasText.value) {
        reader.reset();
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      if (isRsvpMode) {
        reader.increaseWpm();
      } else if (isBionicMode && bionicReader.hasText.value) {
        bionicReader.scrollBy(-SCROLL_AMOUNT);
      }
      break;
    case "ArrowDown":
      e.preventDefault();
      if (isRsvpMode) {
        reader.decreaseWpm();
      } else if (isBionicMode && bionicReader.hasText.value) {
        bionicReader.scrollBy(SCROLL_AMOUNT);
      }
      break;
    case "Home":
      if (isBionicMode && bionicReader.hasText.value) {
        e.preventDefault();
        bionicReader.scrollToTop();
      }
      break;
    case "End":
      if (isBionicMode && bionicReader.hasText.value) {
        e.preventDefault();
        bionicReader.scrollToBottom();
      }
      break;
    case "KeyZ":
      if (isRsvpMode) {
        reader.toggleFocusMode();
      }
      break;
    case "Escape":
      if (isRsvpMode && reader.isFocusMode.value) {
        reader.toggleFocusMode();
      }
      break;
  }
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <div :class="$style.shortcuts" aria-label="Keyboard shortcuts">
    <p><kbd>m</kbd> Mode</p>
    <template v-if="readingMode === 'rsvp'">
      <p><kbd>space</kbd> Play/Pause</p>
      <p><kbd>r</kbd> Reset</p>
      <p><kbd>↑</kbd><kbd>↓</kbd> Speed</p>
      <p><kbd>z</kbd> Focus</p>
    </template>
    <template v-else>
      <p><kbd>↑</kbd><kbd>↓</kbd> Scroll</p>
      <p><kbd>Home</kbd><kbd>End</kbd> Top/Bottom</p>
    </template>
  </div>
</template>

<style lang="scss" module>
.shortcuts {
  display: none;
  align-items: center;
  gap: 16px;
  font-size: 11px;

  @media (hover: hover) and (min-width: 768px) {
    display: flex;
  }
  color: var(--text-muted);
  user-select: none;

  p {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  kbd + kbd {
    margin-left: -5px;
  }
}
</style>
