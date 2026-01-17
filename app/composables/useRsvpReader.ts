// TODO(Teena): Use Pinia store
const text = ref("");
const currentWord = ref("");
const isPlaying = ref(false);
const wpm = ref(300);
const progress = ref(0);
const currentIndex = ref(0);
const isFocusMode = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function useRsvpReader() {
  const hasText = computed(() => text.value.trim().length > 0);

  const words = computed(() => {
    if (!hasText.value) return [];
    return text.value.trim().split(/\s+/).filter(Boolean);
  });

  const wordCount = computed(() => words.value.length);

  const readingTimeSeconds = computed(() => {
    if (wordCount.value === 0) return 0;
    return Math.ceil((wordCount.value / wpm.value) * 60);
  });

  const isComplete = computed(() => {
    return currentIndex.value >= words.value.length && words.value.length > 0;
  });

  function getDelay(word: string): number {
    const baseDelay = (60 / wpm.value) * 1000;
    if (!word || word.length === 0) return baseDelay;

    const len = word.length;
    const lastChar = word.at(-1);

    let multiplier = 1;

    // Longer words need more time
    if (len > 8) multiplier += 0.3;
    if (len > 12) multiplier += 0.2;

    if (lastChar && [".", "!", "?"].includes(lastChar)) multiplier += 0.8;
    else if (lastChar && [",", ";", ":"].includes(lastChar)) multiplier += 0.4;
    else if (lastChar && ['"', "'", ")"].includes(lastChar)) multiplier += 0.2;

    return baseDelay * multiplier;
  }

  function showNextWord() {
    const word = words.value[currentIndex.value];
    if (currentIndex.value >= words.value.length || !word) {
      isPlaying.value = false;
      currentWord.value = "Done";
      return;
    }

    currentWord.value = word;
    progress.value = ((currentIndex.value + 1) / words.value.length) * 100;
    currentIndex.value++;

    const delay = getDelay(word);
    timeoutId = setTimeout(showNextWord, delay);
  }

  function play() {
    if (!hasText.value) return;
    if (isComplete.value) {
      // Restart if completed
      currentIndex.value = 0;
      progress.value = 0;
    }
    isPlaying.value = true;
    showNextWord();
  }

  function pause() {
    isPlaying.value = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause();
    } else {
      play();
    }
  }

  function reset() {
    pause();
    currentWord.value = "";
    currentIndex.value = 0;
    progress.value = 0;
  }

  function loadText(newText: string, startIndex = 0) {
    pause();
    currentWord.value = "";
    text.value = newText;
    // Need to set text first so words computed updates
    currentIndex.value = Math.min(startIndex, words.value.length);
    progress.value = words.value.length > 0 ? (currentIndex.value / words.value.length) * 100 : 0;
  }

  function clear() {
    reset();
    text.value = "";
  }

  function toggleFocusMode() {
    isFocusMode.value = !isFocusMode.value;
  }

  function setWpm(value: number) {
    wpm.value = Math.max(200, Math.min(1000, value));
  }

  function increaseWpm(step = 50) {
    setWpm(wpm.value + step);
  }

  function decreaseWpm(step = 50) {
    setWpm(wpm.value - step);
  }

  return {
    text: readonly(text),
    currentWord: readonly(currentWord),
    isPlaying: readonly(isPlaying),
    wpm,
    progress: readonly(progress),
    currentIndex: readonly(currentIndex),
    isFocusMode: readonly(isFocusMode),

    words,
    wordCount,
    readingTimeSeconds,
    hasText,
    isComplete,

    play,
    pause,
    togglePlay,
    reset,
    loadText,
    clear,
    toggleFocusMode,
    setWpm,
    increaseWpm,
    decreaseWpm,
  };
}
