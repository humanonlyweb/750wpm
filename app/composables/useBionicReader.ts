import type { MaybeRefOrGetter } from "vue";
import type { BionicSegment } from "~/types";

const text = ref("");
const fixationPercent = ref(50);
let contentEl: MaybeRefOrGetter<HTMLElement | null | undefined> | null = null;

export function useBionicReader(el?: MaybeRefOrGetter<HTMLElement | null | undefined>) {
  if (el !== undefined) {
    contentEl = el;
  }
  const hasText = computed(() => text.value.trim().length > 0);

  const words = computed(() => {
    if (!hasText.value) return [];
    return text.value.trim().split(/\s+/).filter(Boolean);
  });

  const wordCount = computed(() => words.value.length);

  function transformWord(word: string): { bold: string; normal: string } {
    const len = word.length;
    if (len <= 1) return { bold: word, normal: "" };

    const fixLen = Math.max(1, Math.ceil(len * (fixationPercent.value / 100)));
    return {
      bold: word.slice(0, fixLen),
      normal: word.slice(fixLen),
    };
  }

  const bionicParagraphs = computed((): BionicSegment[][] => {
    if (!hasText.value) return [];

    const paragraphs = text.value.split(/\n\n+/);

    return paragraphs.map((paragraph) => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      const segments: BionicSegment[] = [];

      words.forEach((word, index) => {
        const { bold, normal } = transformWord(word);
        segments.push({ type: "word", bold, normal });

        if (index < words.length - 1) {
          segments.push({ type: "space", value: " " });
        }
      });

      return segments;
    });
  });

  function loadText(newText: string) {
    text.value = newText;
  }

  function clear() {
    text.value = "";
  }

  function setFixationPercent(value: number) {
    fixationPercent.value = Math.max(30, Math.min(70, value));
  }

  function scrollBy(amount: number) {
    toValue(contentEl)?.scrollBy({ top: amount, behavior: "smooth" });
  }

  function scrollToTop() {
    toValue(contentEl)?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToBottom() {
    const el = toValue(contentEl);
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }

  return {
    text: readonly(text),
    fixationPercent,
    hasText,
    words,
    wordCount,
    bionicParagraphs,
    loadText,
    clear,
    setFixationPercent,
    scrollBy,
    scrollToTop,
    scrollToBottom,
  };
}
