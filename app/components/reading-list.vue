<script setup lang="ts">
import type { Article } from "~/types";

const { selectedId = null } = defineProps<{
  selectedId?: number | null;
}>();

const emit = defineEmits<{
  select: [article: Article];
}>();

const { getArticles, deleteArticle, exportStatistics } = useDatabase();

const articles = ref<Article[]>([]);
const isLoading = ref(true);
const isDialogOpen = ref(false);
const editingArticle = ref<Article | undefined>(undefined);
const isConfirmOpen = ref(false);
const articleToDelete = ref<Article | null>(null);

async function loadArticles() {
  articles.value = await getArticles();
  isLoading.value = false;
}

function handleArticleSaved() {
  loadArticles();
}

function openAddDialog() {
  editingArticle.value = undefined;
  isDialogOpen.value = true;
}

function openEditDialog(article: Article) {
  editingArticle.value = article;
  isDialogOpen.value = true;
}

function handleSelectArticle(article: Article) {
  emit("select", article);
}

function handleDeleteArticle(article: Article, e: Event) {
  e.stopPropagation();
  if (!article.id) return;
  articleToDelete.value = article;
  isConfirmOpen.value = true;
}

async function confirmDelete() {
  if (!articleToDelete.value?.id) return;

  await deleteArticle({ id: articleToDelete.value.id });
  articleToDelete.value = null;
  loadArticles();
}

function handleEditClick(article: Article, e: Event) {
  e.stopPropagation();
  openEditDialog(article);
}

function handleKeydown(article: Article, e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleSelectArticle(article);
    // Blur so keyboard shortcuts (play/pause) work immediately
    (e.target as HTMLElement)?.blur();
  } else if ((e.key === "Backspace" || e.key === "Delete") && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    handleDeleteArticle(article, e);
  }
}

function getPreview(content: string, maxLength = 80): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trim() + "...";
}

function getWordCount(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

function getProgressPercent(article: Article): number {
  if (!article.readingProgress) return 0;
  const words = getWordCount(article.content);
  if (words === 0) return 0;
  return Math.round((article.readingProgress / words) * 100);
}

onMounted(() => {
  loadArticles();
});
</script>

<template>
  <section
    v-if="!isLoading"
    :class="$style.readingListWrap"
    :aria-labelledby="articles.length > 0 ? 'reading-list-title' : undefined"
    :aria-label="articles.length === 0 ? 'Reading list' : undefined"
  >
    <template v-if="articles.length > 0">
      <header :class="$style.header">
        <h2 id="reading-list-title">My Reading List</h2>
        <div :class="$style.headerActions">
          <Button size="small" outline icon="file-download" @click="exportStatistics"
            >Export</Button
          >
          <Button size="small" icon="plus" @click="openAddDialog">Add Article</Button>
        </div>
      </header>

      <ul :class="$style.articleList">
        <li
          v-for="article in articles"
          :key="article.id"
          :class="[$style.articleItem, { [$style.selected]: article.id === selectedId }]"
          tabindex="0"
          role="button"
          :aria-label="`Read ${article.title}`"
          :aria-current="article.id === selectedId ? 'true' : undefined"
          @click="handleSelectArticle(article)"
          @keydown="handleKeydown(article, $event)"
        >
          <div :class="$style.articleHeader">
            <p :class="$style.articleTitle">{{ article.title }}</p>
            <div :class="$style.articleActions">
              <button
                type="button"
                :class="$style.actionButton"
                aria-label="Edit article"
                @click="handleEditClick(article, $event)"
              >
                Edit
              </button>
              <button
                type="button"
                :class="[$style.actionButton, $style.deleteButton]"
                aria-label="Delete article"
                @click="handleDeleteArticle(article, $event)"
              >
                Delete
              </button>
            </div>
          </div>
          <small :class="$style.articlePreview">{{ getPreview(article.content) }}</small>
          <div :class="$style.articleMeta">
            <span>{{ getWordCount(article.content) }} words</span>
            <span v-if="article.readingProgress">{{ getProgressPercent(article) }}% read</span>
          </div>
        </li>
      </ul>
    </template>

    <div v-else :class="$style.emptyState">
      <p>No articles yet.</p>
      <Button size="small" icon="plus" @click="openAddDialog">Add your first article</Button>
    </div>

    <ArticleDialog
      v-model:open="isDialogOpen"
      :article="editingArticle"
      @saved="handleArticleSaved"
    />

    <ConfirmDialog
      v-model:open="isConfirmOpen"
      title="Delete Article"
      description="This action is not reversible."
      confirm-label="Delete"
      @confirm="confirmDelete"
    >
      Are you sure you want to delete "{{ articleToDelete?.title }}"?
    </ConfirmDialog>
  </section>
</template>

<style lang="scss" module>
.readingListWrap {
  margin-block: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 16px;
  margin-bottom: 16px;

  h2 {
    font-size: 1.5rem;
    color: var(--text);
  }
}

.headerActions {
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 400px) {
    width: 100%;

    > * {
      flex: 1;
    }
  }
}

.articleList {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.articleItem {
  --_border-color: oklch(from var(--border) calc(l - 0.1) c h);
  --_color: var(--text-muted);
  position: relative;
  background-color: oklch(from var(--surface) calc(l - 0.02) c h);
  border: 1px solid var(--_border-color);
  border-radius: var(--radius-sm);
  min-height: 120px;
  padding: 16px;
  font-size: 1rem;
  color: var(--_color);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (hover: hover) {
    &:hover {
      --_border-color: oklch(from var(--border) calc(l + 0.05) c h);
      --_color: oklch(from var(--text-muted) calc(l + 0.1) c h);

      .articleActions {
        opacity: 1;
      }
    }
  }

  &:active {
    transform: scale(0.99);
  }

  &.selected {
    --_border-color: var(--accent);

    &::before {
      content: "\2713";
      position: absolute;
      top: -6px;
      right: -6px;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--bg);
      background-color: var(--accent);
      border-radius: var(--radius-full);
    }
  }
}

.articleHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.articleTitle {
  font-weight: 500;
  color: var(--text);
  font-size: 1.3rem;
}

.articleActions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s ease;

  @media (hover: none) {
    opacity: 1;
  }
}

.actionButton {
  font-size: 1.1rem;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: var(--radius-xs);
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.15s ease;

  &:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--text);
    }
  }

  &.deleteButton {
    &:focus-visible {
      outline-color: var(--danger);
    }

    @media (hover: hover) {
      &:hover {
        color: var(--danger);
      }
    }
  }
}

.articlePreview {
  color: var(--text-muted);
  font-size: 1.2rem;
  line-height: 1.4;
  flex: 1;
}

.articleMeta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 24px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 1.3rem;
}
</style>
