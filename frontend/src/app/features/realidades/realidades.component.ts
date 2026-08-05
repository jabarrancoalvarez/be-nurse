import {
  Component, OnInit, AfterViewInit, OnDestroy,
  signal, computed, ElementRef, ViewChildren, QueryList,
  ChangeDetectionStrategy, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap, ScrollTrigger } from '../../core/animations/gsap.config';
import { EditableTextDirective } from '../../shared/editable/editable-text.directive';
import { ContentService, EditableCard } from '../../core/services/content.service';
import { CardGroup } from '../../core/services/card-group';
import { EditModeService } from '../../core/services/edit-mode.service';

interface Articulo {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  emoji: string;
  bg: string;
}

@Component({
  selector: 'app-realidades',
  imports: [RouterLink, EditableTextDirective],
  templateUrl: './realidades.component.html',
  styleUrl: './realidades.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealidadesComponent implements OnInit, AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  editMode = inject(EditModeService);

  private platformId = inject(PLATFORM_ID);

  activeFilter = signal('Todas');
  filters = ['Todas', 'Porno y sexualidad', 'Presión social, expectativas y cuerpo', 'ChemSex'];

  articulos: Articulo[] = [
    {
      title: 'Por qué el porno distorsiona las expectativas',
      slug: 'porno-distorsiona-expectativas',
      category: 'Porno y sexualidad',
      excerpt: 'La pornografía forma parte del entorno digital de muchas personas jóvenes, pero no está diseñada para educar. Puede distorsionar expectativas sobre el cuerpo, el deseo, el consentimiento y las relaciones. En este artículo hablamos de cómo mirarla con pensamiento crítico y qué recursos pueden ayudar a construir una sexualidad más sana, libre y respetuosa.',
      author: 'Lucía García',
      date: '10 de febrero de 2026',
      readTime: '9 min',
      emoji: '🎬',
      bg: '#52796f'
    },
    {
      title: 'Pensé que el problema era mi cuerpo',
      slug: 'problema-era-mi-cuerpo',
      category: 'Presión social, expectativas y cuerpo',
      excerpt: 'Nunca nadie me dijo directamente que mi cuerpo estaba mal. Pero lo sentí muchas veces.',
      author: 'Historia real',
      date: '10 de febrero de 2026',
      readTime: '4 min',
      emoji: '💭',
      bg: '#5a8c5a'
    },
    {
      title: 'ChemSex: cuando las drogas y el sexo se mezclan',
      slug: 'chemsex-drogas-y-sexo',
      category: 'ChemSex',
      excerpt: 'El ChemSex es el uso de sustancias como la metanfetamina, mefedrona o GHB para potenciar las relaciones sexuales. Entender sus riesgos es clave para tomar decisiones informadas y pedir ayuda sin miedo.',
      author: 'Javier Ruiz',
      date: '20 de abril de 2026',
      readTime: '6 min',
      emoji: '💊',
      bg: '#5c5c8a'
    }
  ];

  /**
   * Las tarjetas de arriba son el contenido del build. El grupo las expone en el
   * formato editable comun: los datos propios del articulo (slug, autor, fecha)
   * viajan como campos con nombre.
   */
  private readonly articulosDefaults: EditableCard[] = this.articulos.map(a => ({
    title: a.title,
    body: a.excerpt,
    items: [],
    fields: {
      slug: a.slug,
      author: a.author,
      date: a.date,
      readTime: a.readTime,
      emoji: a.emoji,
      bg: a.bg
    },
    image: '',
    badge: a.category
  }));

  grupoArticulos = new CardGroup('realidades.articulos.cards', this.articulosDefaults, this.content, this.editMode);

  /** Vista de las cards en la forma que espera la plantilla. */
  private articulosVista = computed<Articulo[]>(() =>
    this.grupoArticulos.cards().map(c => ({
      title: c.title,
      excerpt: c.body,
      category: c.badge,
      slug: c.fields?.['slug'] ?? '',
      author: c.fields?.['author'] ?? 'BE-nurse',
      date: c.fields?.['date'] ?? '',
      readTime: c.fields?.['readTime'] ?? '5 min',
      emoji: c.fields?.['emoji'] ?? '📄',
      bg: c.fields?.['bg'] ?? '#52796f'
    }))
  );

  articulosFiltrados = computed(() => {
    const f = this.activeFilter();
    const todos = this.articulosVista();
    if (f === 'Todas') return todos;
    return todos.filter(a => a.category === f);
  });

  /** Crea un articulo nuevo con su propia pagina, lista para rellenar. */
  crearArticulo() {
    const slug = 'articulo-' + Date.now().toString(36);
    const hoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    this.grupoArticulos.addCard({
      title: 'Nuevo artículo',
      body: 'Escribe aquí el resumen que aparecerá en esta tarjeta.',
      badge: this.activeFilter() === 'Todas' ? this.filters[1] : this.activeFilter(),
      fields: { slug, author: 'BE-nurse', date: hoy, readTime: '5 min', emoji: '📝', bg: '#52796f' }
    });
  }

  eliminarArticulo(slug: string) {
    const index = this.grupoArticulos.cards().findIndex(c => c.fields?.['slug'] === slug);
    if (index >= 0) this.grupoArticulos.removeCard(index);
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.animateCards(), 50);
    }
  }

  ngOnInit() {
    this.content.load('realidades');
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.animateCards();
  }

  animateCards() {
    const cards = document.querySelectorAll('.article-card');
    gsap.from(cards, {
      opacity: 0, y: 20,
      duration: 0.5, stagger: 0.08, ease: 'power3.out',
      clearProps: 'all'
    });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
