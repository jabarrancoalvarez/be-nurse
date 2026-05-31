export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  subCategory: string;
  authorName: string;
  publishedAt: Date;
  isPublished: boolean;
  imageUrl: string;
}
