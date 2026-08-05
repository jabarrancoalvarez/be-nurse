import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';
import { ContentService } from '../../../core/services/content.service';
import { EditModeService } from '../../../core/services/edit-mode.service';

@Component({
  selector: 'app-realidad-detalle',
  imports: [RouterLink, DatePipe],
  templateUrl: './realidad-detalle.component.html',
  styleUrl: './realidad-detalle.component.scss'
})
export class RealidadDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private content = inject(ContentService);
  editMode = inject(EditModeService);

  article = signal<Article | null>(null);
  related = signal<Article[]>([]);
  loading = signal(true);
  slug = signal('');

  /**
   * Cada campo se pinta con lo personalizado si existe; si no, con lo publicado
   * en la API. Vaciarlo en modo edicion devuelve el articulo a su version original.
   */
  titulo = computed(() =>
    this.content.text(this.key('title')) ?? this.article()?.title ?? 'Título del artículo');

  categoria = computed(() =>
    this.content.text(this.key('category')) ?? this.article()?.category ?? 'Realidades');

  autor = computed(() =>
    this.content.text(this.key('author')) ?? this.article()?.authorName ?? 'BE-nurse');

  entradilla = computed(() =>
    this.content.text(this.key('excerpt')) ?? this.article()?.excerpt ?? 'Escribe aquí la entradilla del artículo.');

  cuerpo = computed(() =>
    this.content.text(this.key('content')) ?? this.article()?.content ?? '<p>Escribe aquí el contenido del artículo.</p>');

  /** Un articulo creado desde la web no existe en la API: no es un 404 real. */
  existe = computed(() => !!this.article() || this.tienePersonalizacion() || this.editMode.available());

  private tienePersonalizacion() {
    return this.content.text(this.key('title')) !== null
        || this.content.text(this.key('content')) !== null;
  }

  private key(campo: string) {
    return `realidades.art.${this.slug()}.${campo}`;
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.slug.set(slug);
    this.content.load(`realidades.art.${slug}`);

    this.articleService.getBySlug(slug).subscribe({
      next: art => {
        this.article.set(art);
        this.loading.set(false);
        this.articleService.getByCategory(art.category).subscribe(arts => {
          this.related.set(arts.filter(a => a.slug !== slug).slice(0, 3));
        });
      },
      // Sin articulo en la API se sigue adelante: puede ser uno creado desde la web.
      error: () => this.loading.set(false)
    });
  }

  guardar(campo: string, event: Event) {
    const el = event.target as HTMLElement;
    const valor = (campo === 'content' ? el.innerHTML : el.textContent ?? '').trim();
    const actual = this.content.text(this.key(campo));

    if (valor === (actual ?? '').trim()) return;

    this.editMode.reportSaving();

    // Vaciar un campo elimina la personalizacion y recupera el texto publicado.
    const peticion = valor
      ? this.content.saveText(this.key(campo), valor)
      : this.content.resetBlock(this.key(campo));

    peticion.subscribe({
      next: () => this.editMode.reportSaved(),
      error: () => this.editMode.reportError('No se pudo guardar el cambio.')
    });
  }
}
