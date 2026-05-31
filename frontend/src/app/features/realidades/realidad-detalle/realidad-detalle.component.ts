import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-realidad-detalle',
  imports: [RouterLink, DatePipe],
  templateUrl: './realidad-detalle.component.html',
  styleUrl: './realidad-detalle.component.scss'
})
export class RealidadDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);

  article = signal<Article | null>(null);
  related = signal<Article[]>([]);
  loading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.articleService.getBySlug(slug).subscribe({
      next: art => {
        this.article.set(art);
        this.loading.set(false);
        this.articleService.getByCategory(art.category).subscribe(arts => {
          this.related.set(arts.filter(a => a.slug !== slug).slice(0, 3));
        });
      },
      error: () => this.loading.set(false)
    });
  }
}
