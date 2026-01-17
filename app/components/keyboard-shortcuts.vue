<script setup lang="ts">
const reader = useRsvpReader();

function handleKeydown(e: KeyboardEvent) {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    (e.target as HTMLElement).closest("dialog[open]")
  ) {
    return;
  }

  switch (e.code) {
    case "Space":
      e.preventDefault();
      if (reader.hasText.value) {
        reader.togglePlay();
      }
      break;
    case "KeyR":
      if (reader.hasText.value) {
        reader.reset();
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      reader.increaseWpm();
      break;
    case "ArrowDown":
      e.preventDefault();
      reader.decreaseWpm();
      break;
    case "KeyZ":
      reader.toggleFocusMode();
      break;
    case "Escape":
      if (reader.isFocusMode.value) {
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
    <p><kbd>space</kbd> Play/Pause</p>
    <p><kbd>r</kbd> Reset</p>
    <p><kbd>↑</kbd><kbd>↓</kbd> Speed Up/Down</p>
    <p><kbd>z</kbd> Focus</p>
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
