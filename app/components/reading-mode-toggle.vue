<script setup lang="ts">
import type { ReadingMode } from "~/types";

const { mode = "rsvp" } = defineProps<{
  mode?: ReadingMode;
}>();

defineEmits<{
  "update:mode": [value: ReadingMode];
}>();
</script>

<template>
  <div :class="$style.toggleWrap" role="tablist" aria-label="Reading mode">
    <button
      :class="[$style.toggleBtn, { [$style.active]: mode === 'rsvp' }]"
      role="tab"
      :aria-selected="mode === 'rsvp'"
      @click="$emit('update:mode', 'rsvp')"
    >
      RSVP
    </button>
    <button
      :class="[$style.toggleBtn, { [$style.active]: mode === 'bionic' }]"
      role="tab"
      :aria-selected="mode === 'bionic'"
      @click="$emit('update:mode', 'bionic')"
    >
      Bionic
    </button>
  </div>
</template>

<style lang="scss" module>
.toggleWrap {
  display: flex;
  gap: 2px;
  padding: 3px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.toggleBtn {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background-color: transparent;
  border: none;
  border-radius: calc(var(--radius-sm) - 2px);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color var(--transition-default),
    color var(--transition-default);

  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 13px;
  }

  @media (hover: hover) {
    &:hover:not(.active) {
      color: var(--text);
      background-color: var(--border);
    }
  }

  &.active {
    color: var(--text);
    background-color: var(--bg);
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.1);
  }
}
</style>
