import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  onSnapshot, 
  QueryConstraint,
  Unsubscribe 
} from 'firebase/firestore';
import { fetchArticlesFromRest, fetchSingleArticleFromRest } from '../lib/firestoreRest';
import { isPubliclyVisibleArticle } from '../lib/articleUtils';
import { getDeletedArticleIds, mergeWithLocalArticles } from '../lib/localArticles';

export interface ArticleDocument {
  id: string;
  title?: string;
  hook?: string;
  content?: string;
  thumbnail?: string;
  status?: string;
  type?: string;
  category?: string;
  subCategory?: string;
  isPremium?: boolean;
  isDraft?: boolean;
  isArchived?: boolean;
  publishDate?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

export class ArticleService {
  /**
   * Data-level validation check: Returns true only if the article is strictly published.
   * Explicitly excludes 'draft', 'drafts', 'brouillon', 'archive', 'archived', 'archivé',
   * as well as boolean flags `isDraft: true` or `isArchived: true`.
   */
  public static isPublished(articleOrStatus: any): boolean {
    if (!articleOrStatus) return false;
    return isPubliclyVisibleArticle(articleOrStatus);
  }

  /**
   * Data-level validation filter: Takes an array of raw articles and enforces that
   * only published articles are returned. All drafts, archives, and deleted items are stripped out.
   */
  public static filterPublishedArticles<T extends { id?: string; status?: any; isDraft?: boolean; isArchived?: boolean }>(
    articles: T[]
  ): T[] {
    if (!Array.isArray(articles)) return [];
    const deletedIds = getDeletedArticleIds();

    return articles.filter((art) => {
      if (!art || !art.id) return false;
      if (deletedIds.has(art.id)) return false;
      if (art.isDraft === true || art.isArchived === true) return false;
      return isPubliclyVisibleArticle(art);
    });
  }

  /**
   * Query-level builder for public Firestore queries.
   */
  public static getPublicArticlesCollection() {
    return collection(db, 'articles');
  }

  /**
   * Fetches published articles from Firestore with query-level and data-level validation enforcement.
   * Guarantees that no drafts or archived articles ever leak into the user-facing interface.
   */
  public static async fetchPublicArticles(timeoutMs = 6000): Promise<ArticleDocument[]> {
    const rawItems: ArticleDocument[] = [];

    // 1. Query Firestore SDK
    try {
      const articlesRef = collection(db, 'articles');
      const snapshot = await Promise.race([
        getDocs(articlesRef),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore SDK timeout')), timeoutMs))
      ]);

      snapshot.forEach((docSnap) => {
        rawItems.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      console.log(`[ArticleService] Firestore returned ${rawItems.length} raw articles.`);
    } catch (err: any) {
      console.warn(`[ArticleService] Firestore SDK fetch failed (${err?.message}), falling back to HTTPS REST...`);
    }

    // 2. HTTPS REST fallback if SDK failed or returned empty
    if (rawItems.length === 0) {
      try {
        const restItems = await fetchArticlesFromRest();
        if (Array.isArray(restItems) && restItems.length > 0) {
          rawItems.push(...restItems);
          console.log(`[ArticleService] REST API returned ${restItems.length} raw articles.`);
        }
      } catch (restErr) {
        console.warn('[ArticleService] REST fallback fetch error:', restErr);
      }
    }

    // 3. Strict data-level validation filter (strips all drafts, archives, and deleted items)
    const publishedArticles = ArticleService.filterPublishedArticles(rawItems);
    console.log(`[ArticleService] Enforced published filter: ${publishedArticles.length} public articles retained out of ${rawItems.length} raw.`);

    return publishedArticles;
  }

  /**
   * Fetches a single article by ID.
   * If the article is a draft or archived, returns null to enforce strict protection.
   */
  public static async fetchPublicArticleById(id: string): Promise<ArticleDocument | null> {
    if (!id) return null;

    let docData: any = null;

    try {
      const docRef = doc(db, 'articles', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        docData = { id: snap.id, ...snap.data() };
      }
    } catch (err) {
      console.warn(`[ArticleService] Error fetching article ${id} via SDK:`, err);
    }

    if (!docData) {
      try {
        docData = await fetchSingleArticleFromRest(id);
      } catch (restErr) {
        console.warn(`[ArticleService] Error fetching article ${id} via REST:`, restErr);
      }
    }

    if (!docData) return null;

    // Strict validation
    if (!ArticleService.isPublished(docData)) {
      console.warn(`[ArticleService] Article ${id} found but blocked by data-level validation (status: ${docData.status}).`);
      return null;
    }

    return docData;
  }

  /**
   * Subscribes to real-time updates on public articles with strict data-level filtering.
   */
  public static subscribeToPublicArticles(
    onUpdate: (articles: ArticleDocument[]) => void,
    onError?: (error: any) => void
  ): Unsubscribe {
    const articlesRef = collection(db, 'articles');

    return onSnapshot(
      articlesRef,
      (snapshot) => {
        const rawDocs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any)
        }));

        // Strict data-level validation enforcement
        const publicOnly = ArticleService.filterPublishedArticles(rawDocs);
        const merged = mergeWithLocalArticles(publicOnly, false);
        onUpdate(merged);
      },
      (error) => {
        console.warn('[ArticleService] Snapshot listener error:', error);
        if (onError) onError(error);
      }
    );
  }
}

export const articleService = ArticleService;
