<script setup lang="ts">
const {
  size = "medium",
  shape = "circle",
  alt,
} = defineProps<{
  alt: string;
  src?: string;
  size?: "small" | "medium" | "large";
  shape?: "circle" | "square" | "rounded";
}>();

const userInitial = computed(() => {
  const [firstName, lastName] = alt.split(" ");
  return lastName ? firstName?.charAt(0) + lastName.charAt(0) : firstName?.charAt(0);
});
</script>

<template>
  <div :class="[$style.avatar, $style[shape], $style[size]]">
    <img v-if="src" :src="src" :alt="alt" />
    <p v-else>{{ userInitial }}</p>
  </div>
</template>

<style lang="scss" module>
.avatar {
  --_size: 48px;
  --_font-size: 1rem;
  --_border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--_font-size);
  font-weight: 600;
  overflow: hidden;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--_border-radius);
  color: var(--text);
  width: var(--_size);
  height: var(--_size);
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.small {
    --_font-size: 1rem;
    --_size: 28px;
  }

  &.medium {
    --_font-size: 1.125rem;
    --_size: 40px;
  }

  &.large {
    --_font-size: 1.15rem;
    --_size: 48px;
  }

  &.circle {
    --_border-radius: var(--radius-full);
  }

  &.square {
    --_border-radius: 0;
  }

  &.rounded {
    --_border-radius: var(--radius-md);
  }
}
</style>
