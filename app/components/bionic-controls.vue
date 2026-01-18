<script setup lang="ts">
const fixationPercent = defineModel<number>("fixationPercent", { required: true });

const { wordCount = 0 } = defineProps<{
  wordCount?: number;
}>();
</script>

<template>
  <div :class="$style.controlsWrap">
    <div :class="$style.readingInfo">
      <div :class="$style.readingStats">
        <p>
          <strong>{{ wordCount }}</strong> words
        </p>
      </div>

      <NumberInput
        v-model="fixationPercent"
        hint="fixation %"
        size="small"
        :step="5"
        :min="30"
        :max="70"
        aria-label="Fixation percentage"
      />
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
  justify-content: space-between;
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
</style>
