export type Theme = "light" | "dark";

const STORAGE_KEY = "750wpm-theme";

const theme = ref<Theme>("dark");
let initialized = false;

export function useTheme() {
  function applyTheme(newTheme: Theme) {
    if (import.meta.client) {
      document.documentElement.dataset.theme = newTheme;
    }
  }

  function loadFromStorage() {
    if (initialized || !import.meta.client) return;
    initialized = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      theme.value = stored;
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      theme.value = "light";
    }

    applyTheme(theme.value);
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    applyTheme(newTheme);
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, newTheme);
    }
  }

  function toggleTheme() {
    setTheme(theme.value === "dark" ? "light" : "dark");
  }

  onMounted(loadFromStorage);

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
  };
}
