<script setup lang="ts">
import type { IconName } from "~/types";

const { size = 16 } = defineProps<{
  name: IconName;
  size?: number;
}>();
</script>

<template>
  <svg role="img" :width="size" :height="size" aria-hidden="true">
    <use :href="`/icons-sprite.svg#${name}`" />
  </svg>
</template>
