<script setup lang="ts">
const {
  role = "dialog",
  closedBy = "any",
  size = "default",
} = defineProps<{
  title: string;
  description?: string;
  role?: "dialog" | "alertdialog";
  closedBy?: "any" | "closerequest" | "none";
  size?: "default" | "large";
}>();

const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
  close: [returnValue: string];
  cancel: [];
}>();

const dialogRef = useTemplateRef("dialogRef");
const descriptionId = useId();
const titleId = useId();

function showDialog() {
  dialogRef.value?.showModal();
}

function closeDialog(returnValue?: string) {
  dialogRef.value?.close(returnValue);
}

function handleClose() {
  open.value = false;
  emit("close", dialogRef.value?.returnValue ?? "");
}

function handleCancel(e: Event) {
  if (closedBy === "none") {
    e.preventDefault();
    return;
  }
  emit("cancel");
}

function handleBackdropClick(e: MouseEvent) {
  if (closedBy !== "any") return;

  if (e.clientX === 0 && e.clientY === 0) return;

  const rect = dialogRef.value?.getBoundingClientRect();

  if (!rect) return;

  const clickedInDialog =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!clickedInDialog) {
    closeDialog();
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    showDialog();
  } else {
    closeDialog();
  }
});

onMounted(() => {
  if (open.value) {
    showDialog();
  }
});
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="[$style.dialog, size === 'large' && $style.large]"
    :role="role"
    :aria-labelledby="titleId"
    :aria-describedby="description ? descriptionId : undefined"
    @close="handleClose"
    @cancel="handleCancel"
    @click="handleBackdropClick"
  >
    <header :class="$style.header">
      <hgroup :class="$style.hgroup">
        <h2 :id="titleId" :class="$style.title">{{ title }}</h2>
        <p v-if="description" :id="descriptionId" :class="$style.description">
          {{ description }}
        </p>
      </hgroup>
      <button
        v-if="closedBy !== 'none'"
        type="button"
        :class="$style.closeButton"
        aria-label="Close dialog"
        @click="closeDialog()"
      >
        <Icon name="close" :size="16" />
      </button>
    </header>

    <article v-if="$slots.default" :class="$style.content">
      <slot />
    </article>

    <footer v-if="$slots.footer" :class="$style.footer">
      <slot name="footer" :close="closeDialog" />
    </footer>
  </dialog>
</template>

<style lang="scss" module>
.dialog {
  --_dialog-padding: 24px;
  --_dialog-gap: 16px;
  --_dialog-bg: var(--surface);
  --_dialog-border: var(--border);
  --_dialog-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);

  position: fixed;
  margin: auto;
  padding: 0;
  border: 1px solid var(--_dialog-border);
  border-radius: var(--radius-md);
  background: var(--_dialog-bg);
  color: var(--text);
  box-shadow: var(--_dialog-shadow);
  max-width: min(480px, calc(100vw - 32px));
  max-height: min(85vh, calc(100dvh - 32px));
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    --_dialog-padding: 16px;
    max-width: calc(100vw - 24px);
    max-height: min(90vh, calc(100dvh - 24px));
  }

  &.large {
    max-width: min(640px, calc(100vw - 32px));

    @media (max-width: 480px) {
      max-width: calc(100vw - 24px);
    }
  }

  &:not([open]) {
    display: none;
  }

  &::backdrop {
    background: rgb(0 0 0 / 0.6);
    backdrop-filter: blur(2px);
  }

  &[open] {
    animation: dialog-enter 200ms ease-out;

    &::backdrop {
      animation: backdrop-enter 150ms ease-out;
    }
  }

  // Exit animation using @starting-style for browsers that support it
  @supports (transition-behavior: allow-discrete) {
    transition:
      opacity 150ms ease-out,
      transform 150ms ease-out,
      overlay 150ms ease-out allow-discrete,
      display 150ms ease-out allow-discrete;

    &::backdrop {
      transition:
        opacity 100ms ease-out,
        overlay 100ms ease-out allow-discrete,
        display 100ms ease-out allow-discrete;
    }

    @starting-style {
      &[open] {
        opacity: 0;
        transform: translateY(8px) scale(0.96);
      }

      &[open]::backdrop {
        opacity: 0;
      }
    }
  }
}

@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes backdrop-enter {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--_dialog-gap);
  padding: var(--_dialog-padding);
  padding-bottom: 8px;
}

.hgroup {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.description {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.closeButton {
  --outline-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: -4px -4px 0 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-muted);
  outline: 1px solid var(--outline-color);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    outline 0.15s ease,
    transform 0.1s ease-in-out;

  &:focus-visible {
    --outline-color: oklch(from var(--border) calc(l + 0.09) c h);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover {
      background: oklch(from var(--border) l c h / 0.5);
      color: var(--text);
    }
  }
}

.content {
  flex: 1;
  padding: var(--_dialog-padding);
  overflow-y: auto;
  overscroll-behavior: contain;
  font-size: 1.4rem;
  line-height: 1.5;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: var(--_dialog-padding);
  padding-top: 8px;

  :global(form[method="dialog"]) {
    display: contents;
  }
}
</style>
