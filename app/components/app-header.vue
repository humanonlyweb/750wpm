<script setup lang="ts">
const showShortcuts = useState("showHeaderShortcuts", () => false);
</script>

<template>
  <header :class="$style.appHeader">
    <NuxtLink to="/" :class="$style.logoWrap">75<span highlight>0</span>wpm</NuxtLink>
    <div :class="$style.headerActions">
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
</style>
