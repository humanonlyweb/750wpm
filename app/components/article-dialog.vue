<script setup lang="ts">
import type { Article } from "~/types";
import { parseEpub } from "~/utils/parseEpub";

const open = defineModel<boolean>("open", { default: false });
const isLoading = ref(false);
const loadError = ref("");
const isDragging = ref(false);
const showManualInput = ref(false);

const props = defineProps<{
  article?: Article;
}>();

const emit = defineEmits<{
  saved: [id: number];
}>();

const { addArticle, updateArticle } = useDatabase();

const title = ref("");
const content = ref("");
const isSubmitting = ref(false);
const titleInputRef = useTemplateRef("titleInputRef");
const fileInputRef = useTemplateRef("fileInputRef");
const dropZoneRef = useTemplateRef("dropZoneRef");

const isEditMode = computed(() => Boolean(props.article?.id));
const hasContent = computed(() => content.value.trim().length > 0);

const dialogTitle = computed(() => (isEditMode.value ? "Edit Article" : "Add Article"));
const dialogDescription = computed(() =>
  isEditMode.value
    ? "Update the article title or content."
    : "Import an epub, txt, or markdown file to start reading.",
);
const submitLabel = computed(() => (isEditMode.value ? "Save Changes" : "Add Article"));

const wordCount = computed(() => {
  const words = content.value.trim().split(/\s+/).filter(Boolean);
  return words.length;
});

async function handleSubmit() {
  if (!title.value.trim() || !content.value.trim()) return;
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    let id: number;
    if (isEditMode.value && props.article?.id) {
      await updateArticle({
        id: props.article.id,
        title: title.value.trim(),
        content: content.value.trim(),
      });
      id = props.article.id;
    } else {
      id = await addArticle({
        title: title.value.trim(),
        content: content.value.trim(),
      });
    }
    emit("saved", id);
    resetForm();
    open.value = false;
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  title.value = "";
  content.value = "";
  loadError.value = "";
  showManualInput.value = false;
}

function populateForm() {
  if (props.article) {
    title.value = props.article.title;
    content.value = props.article.content;
    showManualInput.value = true;
  } else {
    resetForm();
  }
}

function handleDialogClose() {
  resetForm();
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleDragEnter(e: DragEvent) {
  e.preventDefault();
  isDragging.value = true;
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  const rect = dropZoneRef.value?.getBoundingClientRect();

  if (
    rect &&
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    return;
  }
  isDragging.value = false;
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

async function handleDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;

  const file = e.dataTransfer?.files[0];
  if (file) {
    await processFile(file);
  }
}

async function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    await processFile(file);
  }
  input.value = "";
}

async function processFile(file: File) {
  isLoading.value = true;
  loadError.value = "";

  try {
    const result = await readFile(file);
    content.value = result.content;
    title.value = result.title || file.name.replace(/\.[^/.]+$/, "");
    showManualInput.value = true;
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : "Failed to read file";
  } finally {
    isLoading.value = false;
  }
}

interface FileReadResult {
  title: string;
  content: string;
}

async function readFile(file: File): Promise<FileReadResult> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "epub") {
    return parseEpub(file);
  }

  const fileContent = await readTextFile(file);

  return {
    title: file.name.replace(/\.[^/.]+$/, ""),
    content: fileContent,
  };
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function toggleManualInput() {
  showManualInput.value = !showManualInput.value;
}

function handleDropZoneKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    triggerFileInput();
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    populateForm();
    nextTick(() => {
      if (isEditMode.value) {
        titleInputRef.value?.focus();
      }
    });
  }
});
</script>

<template>
  <DialogBase
    v-model:open="open"
    :title="dialogTitle"
    :description="dialogDescription"
    size="large"
    @close="handleDialogClose"
  >
    <div :class="$style.form">
      <div
        v-if="!isEditMode && !hasContent"
        ref="dropZoneRef"
        :class="[$style.dropZone, { [$style.dragging]: isDragging, [$style.loading]: isLoading }]"
        role="button"
        tabindex="0"
        aria-label="Upload file. Supports epub, txt, and markdown files. Click or press Enter to browse."
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @click="triggerFileInput"
        @keydown="handleDropZoneKeydown"
      >
        <div :class="$style.dropZoneContent">
          <div :class="$style.dropIcon">
            <Icon name="file-upload" :size="32" />
          </div>
          <p v-if="isLoading" :class="$style.dropText">Loading...</p>
          <template v-else>
            <p :class="$style.dropText">
              <span :class="$style.dropTextPrimary">Drop file here</span>
              or click to browse
            </p>
            <p :class="$style.dropHint">Supports .epub, .txt, .md</p>
          </template>
        </div>
      </div>

      <p v-if="loadError" :class="$style.error">{{ loadError }}</p>

      <button
        v-if="!isEditMode && !hasContent"
        type="button"
        :class="$style.manualToggle"
        @click="toggleManualInput"
      >
        {{ showManualInput ? "Hide manual input" : "Or paste text manually" }}
      </button>

      <template v-if="isEditMode || hasContent || showManualInput">
        <div :class="$style.field">
          <label :class="$style.label" for="article-title">Title</label>
          <input
            id="article-title"
            ref="titleInputRef"
            v-model="title"
            type="text"
            :class="$style.input"
            placeholder="Article title"
            required
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <div :class="$style.field">
          <div :class="$style.labelRow">
            <label :class="$style.label" for="article-content">Content</label>
            <div :class="$style.contentMeta">
              <span :class="$style.wordCount">
                {{ wordCount }} {{ wordCount === 1 ? "word" : "words" }}
              </span>
              <button
                v-if="!isEditMode"
                type="button"
                :class="$style.changeFileButton"
                :disabled="isLoading"
                @click="triggerFileInput"
              >
                {{ hasContent ? "Replace with file" : "Import file" }}
              </button>
            </div>
          </div>
          <textarea
            id="article-content"
            v-model="content"
            :class="$style.textarea"
            placeholder="Paste or type text here..."
            required
            rows="10"
            spellcheck="false"
          />
        </div>
      </template>

      <input
        ref="fileInputRef"
        type="file"
        accept=".txt,.md,.epub"
        :class="$style.hiddenInput"
        @change="handleFileChange"
      />
    </div>

    <template #footer>
      <form method="dialog">
        <Button variant="secondary" outline type="submit">Cancel</Button>
      </form>
      <Button
        :disabled="!title.trim() || !content.trim() || isSubmitting"
        :is-loading="isSubmitting"
        @click="handleSubmit"
      >
        {{ submitLabel }}
      </Button>
    </template>
  </DialogBase>
</template>

<style lang="scss" module>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dropZone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  background-color: var(--bg);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    outline 0.15s ease;

  @media (max-width: 480px) {
    min-height: 150px;
    padding: 20px;
  }

  &.dragging,
  &:hover {
    border-color: var(--accent);
    background-color: oklch(from var(--accent) l c h / 0.05);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-color: var(--accent);
  }

  &.loading {
    cursor: wait;
    opacity: 0.7;
  }
}

.dropZoneContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  pointer-events: none;
}

.dropIcon {
  color: var(--text-muted);

  .dragging & {
    color: var(--accent);
  }
}

.dropText {
  font-size: 1.4rem;
  color: var(--text-muted);
}

.dropTextPrimary {
  color: var(--text);
  font-weight: 500;
}

.dropHint {
  font-size: 1.2rem;
  color: var(--text-muted);
}

.manualToggle {
  align-self: center;
  font-size: 1.2rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--text);
      background-color: oklch(from var(--border) l c h / 0.3);
    }
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.labelRow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.label {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: 0.02em;
}

.contentMeta {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.wordCount {
  font-size: 1.1rem;
  color: var(--text-muted);
}

.changeFileButton {
  font-size: 1.1rem;
  color: var(--accent);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  padding: 2px 4px;
  margin: -2px -4px;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  &:disabled {
    color: var(--text-muted);
    cursor: wait;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      color: oklch(from var(--accent) calc(l + 0.1) c h);
    }
  }
}

.input,
.textarea {
  width: 100%;
  padding: 12px 14px;
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--text);
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    border-color: oklch(from var(--border) calc(l + 0.15) c h);
  }
}

.textarea {
  resize: vertical;
  min-height: 180px;
  line-height: 1.6;
  font-family: var(--font-libre);
}

.hiddenInput {
  display: none;
}

.error {
  font-size: 1.2rem;
  color: var(--danger);
  text-align: center;
}
</style>
