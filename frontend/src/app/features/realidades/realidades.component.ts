import {
  Component, OnInit, AfterViewInit, OnDestroy,
  signal, computed, ElementRef, ViewChildren, QueryList,
  ChangeDetectionStrategy, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap, ScrollTrigger } from '../../core/animations/gsap.config';

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
  imports: [RouterLink],
  templateUrl: './realidades.component.html',
  styleUrl: './realidades.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealidadesComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  activeFilter = signal('Todas');
  filters = ['Todas', 'Porno y sexualidad', 'Presion social, expectativas y cuerpo', 'ChemSex'];

  articulos: Articulo[] = [
    {
      title: 'Por que el porno distorsiona expectativas',
      slug: 'porno-distorsiona-expectativas',
      category: 'Porno y sexualidad',
      excerpt: 'El porno esta en internet, en redes y en muchos moviles. Verlo no te convierte en una mala persona. El problema no es verlo, sino aprender de el.',
      author: 'Lucia Garcia',
      date: '10 de febrero de 2026',
      readTime: '5 min',
      emoji: '🎬',
      bg: '#52796f'
    },
    {
      title: 'Pense que el problema era mi cuerpo',
      slug: 'problema-era-mi-cuerpo',
      category: 'Presion social, expectativas y cuerpo',
      excerpt: 'Nunca nadie me dijo directamente que mi cuerpo estaba mal. Pero lo senti muchas veces.',
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

  articulosFiltrados = computed(() => {
    const f = this.activeFilter();
    if (f === 'Todas') return this.articulos;
    return this.articulos.filter(a => a.category === f);
  });

  setFilter(filter: string) {
    this.activeFilter.set(filter);
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.animateCards(), 50);
    }
  }

  ngOnInit() {}

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
