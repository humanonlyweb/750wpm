<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{
  error: NuxtError;
}>();

const statusCode = computed(() => error.statusCode || 500);
const statusMessage = computed(() => {
  if (statusCode.value === 404) return "Page not found";
  return error.statusMessage || "Something went wrong";
});
</script>

<template>
  <div :class="$style.errorPage">
    <div :class="$style.content">
      <h1 :class="$style.code">{{ statusCode }}</h1>
      <p :class="$style.message">{{ statusMessage }}</p>
      <Button @click="clearError({ redirect: '/' })">Go Home</Button>
    </div>
  </div>
</template>

<style lang="scss" module>
.errorPage {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.code {
  font-size: clamp(80px, 20vw, 150px);
  font-weight: 700;
  color: var(--text);
  line-height: 1;
  margin: 0;
}

.message {
  font-size: 1.4rem;
  color: var(--text-muted);
  margin: 0;
}
</style>
