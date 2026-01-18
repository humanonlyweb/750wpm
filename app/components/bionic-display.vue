<script setup lang="ts">
import type { BionicSegment } from "~/types";

const { paragraphs = [], hasText = false } = defineProps<{
  paragraphs?: BionicSegment[][];
  hasText?: boolean;
}>();

defineEmits<{
  loadDemo: [];
}>();

const contentRef = useTemplateRef("contentRef");
useBionicReader(contentRef);
</script>

<template>
  <div :class="[$style.readerWrap, { [$style.empty]: !hasText }]">
    <div v-if="!hasText" :class="$style.placeholderText">
      <p>Load an article to start reading</p>
      <p>or try</p>
      <Button size="small" outline @click="$emit('loadDemo')"> How it works </Button>
    </div>

    <article v-else ref="contentRef" :class="$style.bionicContent">
      <p v-for="(paragraph, pIndex) in paragraphs" :key="pIndex" :class="$style.paragraph">
        <template v-for="(segment, sIndex) in paragraph" :key="sIndex">
          <template v-if="segment.type === 'word'">
            <span :class="$style.word"
              ><strong>{{ segment.bold }}</strong
              >{{ segment.normal }}</span
            >
          </template>
          <template v-else>{{ segment.value }}</template>
        </template>
      </p>
    </article>
  </div>
</template>

<style lang="scss" module>
.readerWrap {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  background-color: var(--surface);
  min-height: 350px;
  max-height: 60vh;
  border-radius: var(--radius-sm);

  @media (max-width: 480px) {
    min-height: 250px;
    max-height: 50vh;
  }

  &.empty {
    align-items: center;
    justify-content: center;
  }
}

.placeholderText {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  text-align: center;
}

.bionicContent {
  flex: 1;
  min-height: 0;
  padding: 24px 28px;
  overflow-y: auto;
  font-family: var(--font-libre);
  font-size: 17px;
  line-height: 1.75;
  letter-spacing: 0.01em;

  @media (max-width: 480px) {
    padding: 20px;
    font-size: 15px;
  }
}

.paragraph {
  margin-bottom: 1.5em;

  &:last-child {
    margin-bottom: 0;
  }
}

.word {
  strong {
    font-weight: 700;
  }
}
</style>
