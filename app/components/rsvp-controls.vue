<script setup lang="ts">
const wpm = defineModel<number>("wpm", { required: true });

const {
  wordCount = 0,
  readingTimeSeconds = 0,
  progress = 0,
  isPlaying = false,
} = defineProps<{
  wordCount?: number;
  readingTimeSeconds?: number;
  progress?: number;
  isPlaying?: boolean;
}>();

defineEmits<{
  togglePlay: [];
  reset: [];
}>();
</script>

<template>
  <div :class="$style.controlsWrap">
    <div :class="$style.readingInfo">
      <div :class="$style.readingStats">
        <p>
          <strong>{{ wordCount }}</strong> words
        </p>
        <p>
          <strong>{{ readingTimeSeconds }}</strong
          >s
        </p>
      </div>

      <progress
        :value="progress"
        max="100"
        :class="$style.readingProgress"
        aria-label="Reading progress"
      />

      <NumberInput
        v-model="wpm"
        hint="current wpm"
        size="small"
        :step="50"
        :min="200"
        :max="1000"
        aria-label="Words per minute"
      />
    </div>

    <div :class="$style.buttons">
      <Button outline @click="$emit('reset')">Reset</Button>
      <Button @click="$emit('togglePlay')">
        {{ isPlaying ? "Pause" : "Play" }}
      </Button>
    </div>
  </div>
</template>

<style lang="scss" module>
.controlsWrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.readingInfo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 24px;
  width: 100%;

  @media (max-width: 480px) {
    justify-content: space-between;
  }
}

.readingStats {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  color: var(--text-muted);

  p {
    position: relative;

    &:not(:first-child)::before {
      content: "·";
      position: absolute;
      font-weight: 600;
      left: -14px;
      color: var(--text-muted);
    }
  }

  strong {
    color: var(--text);
    font-weight: 600;
  }
}

.readingProgress {
  flex: 1 1 0;
  min-width: 100px;
  height: 2px;
  appearance: none;
  border: none;
  background-color: var(--surface);
  overflow: hidden;
  border-radius: 1px;

  @media (max-width: 480px) {
    order: 3;
    flex-basis: 100%;
  }

  &::-webkit-progress-bar {
    background-color: var(--surface);
  }

  &::-webkit-progress-value {
    background-color: var(--accent);
    transition: width 0.15s ease-out;
  }

  &::-moz-progress-bar {
    background-color: var(--accent);
    transition: width 0.15s ease-out;
  }
}

.buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}
</style>
