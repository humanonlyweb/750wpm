<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });

const {
  title = "Confirm",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
} = defineProps<{
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

function handleConfirm() {
  emit("confirm");
  open.value = false;
}

function handleCancel() {
  emit("cancel");
  open.value = false;
}
</script>

<template>
  <DialogBase
    v-model:open="open"
    :title="title"
    :description="description"
    role="alertdialog"
    closed-by="closerequest"
    @close="handleCancel"
  >
    <slot />

    <template #footer>
      <Button variant="secondary" outline @click="handleCancel">
        {{ cancelLabel }}
      </Button>
      <Button :variant="variant" @click="handleConfirm">
        {{ confirmLabel }}
      </Button>
    </template>
  </DialogBase>
</template>
