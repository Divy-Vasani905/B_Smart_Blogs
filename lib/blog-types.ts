/**
 * Blog post types. Safe to import in client and server components (no Node.js deps).
 */
export interface BlogPost {
  slug: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
  views: number;
}
