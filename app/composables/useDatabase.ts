import Dexie, { type EntityTable } from "dexie";

import type { Article } from "~/types";

const db = new Dexie("750wpmDB") as Dexie & {
  articles: EntityTable<Article, "id">;
};

db.version(1).stores({
  articles: "++id, title, createdAt, updatedAt",
});

export function useDatabase() {
  async function getArticles(): Promise<Article[]> {
    return db.articles.orderBy("createdAt").reverse().toArray();
  }

  async function getArticle(params: { id: number }): Promise<Article | undefined> {
    return db.articles.get(params.id);
  }

  async function addArticle(params: { title: string; content: string }): Promise<number> {
    const now = new Date();
    const id = await db.articles.add({
      title: params.title,
      content: params.content,
      createdAt: now,
      updatedAt: now,
    });
    return id as number;
  }

  async function updateArticle(params: {
    id: number;
    title?: string;
    content?: string;
  }): Promise<number> {
    const updates: Partial<Article> = {
      updatedAt: new Date(),
    };
    if (params.title !== undefined) updates.title = params.title;
    if (params.content !== undefined) updates.content = params.content;

    return db.articles.update(params.id, updates);
  }

  async function updateReadingProgress(params: { id: number; progress: number }): Promise<number> {
    return db.articles.update(params.id, {
      readingProgress: params.progress,
    });
  }

  async function deleteArticle(params: { id: number }): Promise<void> {
    return db.articles.delete(params.id);
  }

  async function exportStatistics(): Promise<void> {
    const articles = await getArticles();

    const stats = articles.map((article) => {
      const wordCount = article.content.trim().split(/\s+/).filter(Boolean).length;
      const wordsRead = article.readingProgress ?? 0;
      const progressPercent = wordCount > 0 ? Math.round((wordsRead / wordCount) * 100) : 0;

      return {
        title: article.title,
        wordCount,
        wordsRead,
        progressPercent,
        createdAt: article.createdAt.toISOString(),
      };
    });

    const totalWords = stats.reduce((sum, s) => sum + s.wordCount, 0);
    const totalWordsRead = stats.reduce((sum, s) => sum + s.wordsRead, 0);

    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalArticles: stats.length,
        totalWords,
        totalWordsRead,
        overallProgress: totalWords > 0 ? Math.round((totalWordsRead / totalWords) * 100) : 0,
      },
      articles: stats,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `750wpm-stats-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    db,
    getArticles,
    getArticle,
    addArticle,
    updateArticle,
    updateReadingProgress,
    deleteArticle,
    exportStatistics,
  };
}
