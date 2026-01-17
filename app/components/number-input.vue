<script setup lang="ts">
const {
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = "normal",
  hint,
  disabled = false,
  ariaLabel = "Number input",
  id,
} = defineProps<{
  min?: number;
  max?: number;
  step?: number;
  size?: "small" | "normal";
  hint?: string;
  disabled?: boolean;
  ariaLabel?: string;
  id?: string;
}>();

const model = defineModel<number>({ default: 0 });
const formId = computed(() => id ?? `number-input-${useId()}`);

function clamp(value: number): number {
  return Math.min(max, Math.max(min, value));
}

function decrement() {
  if (disabled) return;
  model.value = clamp(model.value - step);
}

function increment() {
  if (disabled) return;
  model.value = clamp(model.value + step);
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  if (!Number.isNaN(value)) {
    model.value = clamp(value);
  }
}

const iconSize = computed(() => (size === "small" ? 11 : 16));

const canDecrement = computed(() => !disabled && model.value > min);
const canIncrement = computed(() => !disabled && model.value < max);
</script>

<template>
  <div :class="$style.numberInputWrap">
    <div :class="[$style.numberInput, $style[size], { [$style.disabled]: disabled }]">
      <button
        type="button"
        :class="$style.numberInputBtn"
        :disabled="!canDecrement"
        :aria-label="`Decrease ${ariaLabel}`"
        @mousedown.prevent="decrement"
      >
        <Icon name="minus" :size="iconSize" />
      </button>

      <input
        type="number"
        :id="formId"
        :class="$style.numberInputField"
        :value="model"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-label="ariaLabel"
        autocomplete="off"
        @input="onInput"
      />

      <button
        type="button"
        :class="$style.numberInputBtn"
        :disabled="!canIncrement"
        :aria-label="`Increase ${ariaLabel}`"
        @mousedown.prevent="increment"
      >
        <Icon name="plus" :size="iconSize" />
      </button>
    </div>
    <span v-if="hint" :class="$style.numberInputHint">{{ hint }}</span>
  </div>
</template>

<style module lang="scss">
.numberInputWrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.numberInputHint {
  position: absolute;
  top: calc(100% + 4px);
  font-size: 1.1rem;
  color: var(--text-muted);
}

.numberInput {
  --_btn-size: 44px;
  --_btn-padding: 12px;
  --_field-width: 64px;
  --_field-padding: 12px 8px;
  --_font-size: 1.6rem;

  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;

  &.small {
    --_btn-size: 28px;
    --_btn-padding: 8px;
    --_field-width: 40px;
    --_field-padding: 8px 4px;
    --_font-size: 1.2rem;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &Btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--_btn-size);
    padding: var(--_btn-padding);
    background: transparent;
    border: none;
    color: var(--text);
    cursor: pointer;
    user-select: none;
    transition:
      background-color 120ms ease,
      color 120ms ease;

    &:not(:disabled):hover {
      @media (hover: hover) {
        background: var(--surface);
      }
    }

    &:not(:disabled):active {
      background: var(--border);
    }

    &:disabled {
      color: oklch(from var(--text) calc(l - 0.5) c h);
      cursor: not-allowed;
    }

    &:focus-visible:not(:disabled) {
      outline: none;
      box-shadow: inset 0 0 0 1px var(--accent);
    }
  }

  &Field {
    width: var(--_field-width);
    padding: var(--_field-padding);
    background: transparent;
    border: none;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    color: var(--text);
    text-align: center;
    font-size: var(--_font-size);
    font-variant-numeric: tabular-nums;
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: none;
      background: var(--surface);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
