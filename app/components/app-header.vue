<script setup lang="ts">
const showShortcuts = useState("showHeaderShortcuts", () => false);
</script>

<template>
  <header :class="$style.appHeader">
    <NuxtLink to="/" :class="$style.logoWrap">75<span highlight>0</span>wpm</NuxtLink>
    <div :class="$style.headerActions">
      <NuxtLink to="/test" :class="$style.testLink">Speed Test</NuxtLink>
      <KeyboardShortcuts v-if="showShortcuts" />
      <ThemeToggle />
    </div>
  </header>
</template>

<style lang="scss" module>
.appHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 56px;

  .logoWrap {
    font-family: var(--font-libre);
    font-weight: 600;
    font-size: 16px;
  }
}

.headerActions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.testLink {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition:
    color var(--transition-default),
    border-color var(--transition-default);

  @media (hover: hover) {
    &:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
  }
}
</style>
