import {
  Component, OnInit, OnDestroy, AfterViewInit,
  signal, ElementRef, ViewChildren, QueryList,
  ChangeDetectionStrategy, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap, ScrollTrigger } from '../../core/animations/gsap.config';
import { staggerFadeIn } from '../../core/animations/animations';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-informate',
  templateUrl: './informate.component.html',
  styleUrl: './informate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformateComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  @ViewChildren('faqContent') faqContents!: QueryList<ElementRef>;

  faqs = signal<FaqItem[]>([
    {
      question: '¿Puedo tener una ITS sin sintomas?',
      answer: 'Si. Muchas ITS como la clamidia, el VPH o incluso el VIH pueden no dar sintomas durante meses o años. Por eso las pruebas periodicas son fundamentales.',
      open: false
    },
    {
      question: '¿El preservativo protege al 100%?',
      answer: 'El preservativo usado correctamente tiene una eficacia muy alta (98%) pero no es 100% infalible. Protege frente a la mayoria de ITS, aunque algunas como el herpes o el VPH pueden transmitirse por contacto con areas no cubiertas.',
      open: false
    },
    {
      question: '¿El sexo oral tiene riesgo?',
      answer: 'Si. El sexo oral puede transmitir gonorrea, sifilis, herpes, VPH y en menor medida VIH. El riesgo se reduce con el uso de preservativo o dental dam.',
      open: false
    },
    {
      question: '¿Me da verguenza pedir una prueba, es normal?',
      answer: 'Completamente normal. Pero recuerda que los profesionales sanitarios estan acostumbrados y no juzgan. Hacerse pruebas es un acto de responsabilidad con tu salud.',
      open: false
    },
    {
      question: '¿Si una prueba sale positiva, que hago?',
      answer: 'Primero, no entrar en panico. La mayoria de las ITS tienen tratamiento. Contacta con tu medico o centro de salud sexual, sigue el tratamiento y comunica el resultado a tus parejas recientes para que puedan hacerse pruebas.',
      open: false
    }
  ]);

  itsCards = [
    { name: 'VIH', emoji: '🔴', color: '#1e6b3c', desc: 'Virus que ataca el sistema inmunitario. Con tratamiento antirretroviral, vida plena y normal.' },
    { name: 'VPH', emoji: '🟡', color: '#2e7d32', desc: 'La ITS mas comun. Hay vacuna disponible. Puede causar verrugas y distintos tipos de cancer.' },
    { name: 'Clamidia', emoji: '🟠', color: '#388e3c', desc: 'Bacteria silenciosa. Muy comun y tratable con antibioticos. Fundamental hacerse pruebas.' },
    { name: 'Gonorrea', emoji: '🟣', color: '#1b5e20', desc: 'Bacteria con resistencias crecientes. Tratable pero requiere atencion rapida.' },
    { name: 'Sifilis', emoji: '🔵', color: '#155c30', desc: 'Progresa en fases distintas. Totalmente curable con penicilina si se detecta a tiempo.' },
    { name: 'Herpes genital', emoji: '⚪', color: '#0e4423', desc: 'Virus cronico pero manejable. Muy frecuente y con tratamiento antiviral eficaz.' },
    { name: 'Hepatitis B', emoji: '🟤', color: '#1a6b3c', desc: 'Hay vacuna. Puede cronificarse. Se transmite por sangre y fluidos sexuales.' },
    { name: 'Hepatitis C', emoji: '🟢', color: '#166b4c', desc: 'Principalmente por sangre. Curable con tratamientos modernos de alta eficacia.' }
  ];

  activeSection = signal('definicion');
  private observer: IntersectionObserver | null = null;

  ngOnInit() {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // ITS cards stagger
    const cards = document.querySelectorAll('.its-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '#its-comunes', start: 'top 80%' }
      }
    );

    // Section observer
    this.initSectionObserver();
  }

  private initSectionObserver() {
    const sections = document.querySelectorAll('.content-section');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => this.observer!.observe(s));
  }

  toggleFaq(index: number) {
    const currentFaqs = this.faqs();
    const isOpen = currentFaqs[index].open;

    // Close all first
    this.faqs.update(items => items.map(item => ({ ...item, open: false })));

    // Get all content elements and close them
    this.faqContents.forEach(ref => {
      gsap.to(ref.nativeElement, { height: 0, duration: 0.35, ease: 'power2.in' });
    });

    if (!isOpen) {
      // Open the clicked one
      this.faqs.update(items =>
        items.map((item, i) => ({ ...item, open: i === index }))
      );

      const contentEl = this.faqContents.toArray()[index]?.nativeElement;
      if (contentEl) {
        gsap.fromTo(contentEl,
          { height: 0 },
          { height: contentEl.scrollHeight, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
