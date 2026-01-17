<script setup lang="ts">
import { NuxtLink } from "#components";
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import type { IconName } from "~/types";

const {
  variant = "primary",
  size = "normal",
  outline = false,
  ghost = false,
  type = "button",
  compact = false,
  iconPosition = "left",
  to,
  href,
  disabled,
} = defineProps<{
  variant?: "primary" | "danger" | "secondary" | "light";
  size?: "normal" | "small";
  outline?: boolean;
  ghost?: boolean;
  type?: HTMLButtonElement["type"];
  fullWidth?: boolean;
  compact?: boolean;
  to?: RouteLocationRaw;
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
  iconPosition?: "left" | "right";
  icon?: IconName;
}>();

const component = computed(() => (to || href ? NuxtLink : "button"));
const componentProps = computed(() => {
  if (to) {
    return { to };
  } else if (href) {
    return { href, external: true, rel: "noopener noreferrer" };
  }
  return { type, disabled };
});

const iconSize = computed(() => (size === "small" ? 13 : 15));
</script>

<template>
  <component
    :is="component"
    v-bind="componentProps"
    :class="[
      $style[variant],
      $style.button,
      $style[size],
      { [$style.fullWidth]: fullWidth },
      { [$style.outline]: outline, [$style.ghost]: ghost, [$style.compact]: compact },
    ]"
  >
    <Icon v-if="isLoading" name="spinner" :class="$style.spinner" :size="13" />
    <span :class="{ [$style.hidden]: isLoading }">
      <Icon v-if="icon && iconPosition === 'left'" :name="icon" :size="iconSize" />
      <slot />
      <Icon v-if="icon && iconPosition === 'right'" :name="icon" :size="iconSize" />
    </span>
  </component>
</template>

<style lang="scss" module>
.button {
  --_btn-bg: transparent;
  --_btn-border: transparent;
  --_btn-outline: transparent;
  --_btn-color: var(--text);
  --_font-size: 13px;

  display: inline-grid;
  place-items: center;
  gap: 6px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  width: max-content;
  flex-shrink: 0;
  background-color: var(--_btn-bg);
  color: var(--_btn-color);
  border: 1px solid var(--_btn-border);
  outline: 1px solid var(--_btn-outline);
  font-size: var(--_font-size);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
  transition:
    background-color var(--transition-default),
    border-color var(--transition-default),
    color var(--transition-default),
    outline var(--transition-default),
    transform 0.1s ease-in-out;

  > * {
    grid-area: 1 / 1;
  }

  &:not(.outline, .ghost) {
    text-shadow: 1px 1px 2px oklch(from var(--bg) calc(l - 0.4) c h / 0.2);
  }

  &.primary,
  &.danger,
  &.secondary,
  &.light {
    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.fullWidth {
    width: 100%;
  }

  &.normal {
    padding: 12px 20px;
  }

  &.small {
    --_font-size: 12px;
    padding: 8px 12px;
    gap: var(--spacing-1);

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &.compact {
    padding-inline: 0;
  }

  &.primary {
    --_btn-bg: var(--accent);

    &:hover:not(:disabled) {
      --_btn-bg: oklch(from var(--accent) calc(l + 0.05) c h);
    }

    &:active:not(:disabled) {
      --_btn-bg: oklch(from var(--accent) calc(l - 0.03) c h);
      transform: scale(0.98);
    }

    &:focus-visible {
      --_btn-outline: var(--accent);
    }

    &:not(.ghost):not(.outline) {
      box-shadow: inset 0 0.5px 0 0 oklch(from var(--accent) calc(l + 0.09) c h);
    }
  }

  &.danger {
    --_btn-bg: var(--danger);

    &:hover:not(:disabled) {
      --_btn-bg: oklch(from var(--danger) calc(l + 0.05) c h);
    }

    &:active:not(:disabled) {
      --_btn-bg: oklch(from var(--danger) calc(l - 0.03) c h);
      transform: scale(0.98);
    }

    &:focus-visible {
      --_btn-outline: var(--danger);
    }
  }

  &.secondary {
    --_btn-bg: var(--border-default);

    &:hover:not(:disabled) {
      --_btn-color: var(--text-color);
      --_btn-bg: oklch(from var(--border-default) calc(l + 0.05) c h);
    }

    &:active:not(:disabled) {
      --_btn-bg: oklch(from var(--border-default) calc(l - 0.03) c h);
      transform: scale(0.98);
    }

    &:focus-visible {
      --_btn-color: var(--text-color);
      --_btn-outline: oklch(from var(--border-default) calc(l + 0.09) c h);
    }
  }

  &.light {
    --_btn-bg: var(--text-base);
    --_btn-color: var(--text-on-page);

    &:hover:not(:disabled) {
      --_btn-bg: oklch(from var(--text-base) calc(l - 0.05) c h);
    }

    &:active:not(:disabled) {
      --_btn-bg: oklch(from var(--text-base) calc(l - 0.1) c h);
      transform: scale(0.98);
    }

    &:focus-visible {
      --_btn-outline: var(--text-base);
    }
  }

  &.outline {
    --_btn-bg: transparent;

    &.primary {
      --_btn-border: var(--accent);
      --_btn-color: var(--accent);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--accent) l c h / 0.08);
        --_btn-border: oklch(from var(--accent) calc(l + 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--accent) l c h / 0.15);
        transform: scale(0.98);
      }
    }

    &.danger {
      --_btn-border: var(--danger);
      --_btn-color: var(--danger);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--danger) l c h / 0.08);
        --_btn-border: oklch(from var(--danger) calc(l + 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--danger) l c h / 0.15);
      }
    }

    &.secondary {
      --_btn-border: var(--border-default);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--border-default) l c h / 0.08);
        --_btn-border: oklch(from var(--border-default) calc(l + 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--border-default) l c h / 0.15);
      }
    }

    &.light {
      --_btn-border: var(--text-base);
      --_btn-color: var(--text-base);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--text-base) l c h / 0.08);
        --_btn-border: oklch(from var(--text-base) calc(l - 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--text-base) l c h / 0.15);
      }
    }
  }

  &.ghost {
    --_btn-bg: transparent;
    --_btn-border: transparent;

    &.primary {
      --_btn-color: var(--accent);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--accent) l c h / 0.08);
        --_btn-color: oklch(from var(--accent) calc(l + 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--accent) l c h / 0.15);
      }
    }

    &.danger {
      --_btn-color: var(--danger);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--danger) l c h / 0.08);
        --_btn-color: oklch(from var(--danger) calc(l + 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--danger) l c h / 0.15);
      }
    }

    &.secondary {
      --_btn-color: var(--text-base);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--border-default) l c h / 0.08);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--border-default) l c h / 0.15);
      }
    }

    &.light {
      --_btn-color: var(--text-base);

      &:hover:not(:disabled) {
        --_btn-bg: oklch(from var(--text-base) l c h / 0.08);
        --_btn-color: oklch(from var(--text-base) calc(l - 0.05) c h);
      }

      &:active:not(:disabled) {
        --_btn-bg: oklch(from var(--text-base) l c h / 0.15);
      }
    }
  }

  .spinner {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  .hidden {
    opacity: 0;
  }

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
