import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.base}/articles`);
  }

  getBySlug(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.base}/articles/${slug}`);
  }

  getByCategory(category: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.base}/articles/category/${category}`);
  }
}
