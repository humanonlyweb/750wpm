import type { ReadingMode } from "~/types";

const STORAGE_KEY = "750wpm-reading-mode";
const FIXATION_KEY = "750wpm-fixation-percent";

const readingMode = ref<ReadingMode>("rsvp");
const fixationPercent = ref(50);
const isHydrated = ref(false);

let initialized = false;

export function useReadingMode() {
  function loadFromStorage() {
    if (initialized || !import.meta.client) return;
    initialized = true;

    const storedMode = localStorage.getItem(STORAGE_KEY);
    if (storedMode === "rsvp" || storedMode === "bionic") {
      readingMode.value = storedMode;
    }

    const storedFixation = localStorage.getItem(FIXATION_KEY);
    if (storedFixation) {
      const parsed = parseInt(storedFixation, 10);
      if (!isNaN(parsed) && parsed >= 30 && parsed <= 70) {
        fixationPercent.value = parsed;
      }
    }

    isHydrated.value = true;
  }

  function setReadingMode(mode: ReadingMode) {
    readingMode.value = mode;
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }

  function toggleReadingMode() {
    setReadingMode(readingMode.value === "rsvp" ? "bionic" : "rsvp");
  }

  function setFixationPercent(value: number) {
    fixationPercent.value = Math.max(30, Math.min(70, value));
    if (import.meta.client) {
      localStorage.setItem(FIXATION_KEY, String(fixationPercent.value));
    }
  }

  onMounted(loadFromStorage);

  return {
    readingMode: readonly(readingMode),
    fixationPercent,
    isHydrated: readonly(isHydrated),
    setReadingMode,
    toggleReadingMode,
    setFixationPercent,
  };
}
