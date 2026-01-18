<script setup lang="ts">
const { theme, toggleTheme } = useTheme();
</script>

<template>
  <button type="button" :class="$style.themeToggle" :aria-label="`Switch to ${theme} mode`" @click="toggleTheme">
    <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
  </button>
</template>

<style lang="scss" module>
.themeToggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color var(--transition-default),
    color var(--transition-default),
    border-color var(--transition-default);

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--text);
      background-color: var(--surface);
    }
  }

  &:active {
    background-color: var(--border);
  }
}
</style>
