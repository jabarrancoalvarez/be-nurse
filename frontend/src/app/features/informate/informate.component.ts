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
    {
      name: 'VIH', emoji: '🔴',
      desc: 'Virus que ataca el sistema inmunitario. Sin tratamiento puede evolucionar a SIDA. Con terapia antirretroviral moderna, las personas con VIH tienen una esperanza de vida normal.',
      tags: ['Crónico', 'Tratable', 'PrEP disponible'],
      transmission: 'Sangre, fluidos sexuales, leche materna'
    },
    {
      name: 'VPH', emoji: '🟡',
      desc: 'La infección de transmisión sexual más común. La mayoría de personas la contraen en algún momento. Puede causar verrugas genitales y en algunos casos cáncer de cuello uterino, anal u orofaríngeo.',
      tags: ['Muy común', 'Vacuna disponible', 'Autolimitado'],
      transmission: 'Contacto piel con piel, relaciones sexuales'
    },
    {
      name: 'Clamidia', emoji: '🟠',
      desc: 'La ITS bacteriana más frecuente. En la mayoría de los casos no da síntomas, por eso se la llama la infección silenciosa. Sin tratamiento puede causar enfermedad inflamatoria pélvica e infertilidad.',
      tags: ['Sin síntomas', 'Curable', 'Antibióticos'],
      transmission: 'Relaciones sexuales sin protección'
    },
    {
      name: 'Gonorrea', emoji: '🟣',
      desc: 'Bacteria que afecta genitales, recto y garganta. Está desarrollando resistencias a los antibióticos, lo que la hace cada vez más difícil de tratar. Requiere atención médica rápida.',
      tags: ['Resistencia creciente', 'Curable', 'Urgente tratar'],
      transmission: 'Relaciones sexuales sin protección'
    },
    {
      name: 'Sífilis', emoji: '🔵',
      desc: 'Infección bacteriana que progresa en fases: primaria, secundaria, latente y terciaria. En sus primeras fases es completamente curable con penicilina. Si no se trata puede causar daños graves.',
      tags: ['Fases progresivas', 'Curable', 'Penicilina'],
      transmission: 'Contacto directo con úlceras, relaciones sexuales'
    },
    {
      name: 'Herpes genital', emoji: '⚪',
      desc: 'Infección viral crónica causada por el VHS-2 (principalmente). No tiene cura pero el tratamiento antiviral reduce la frecuencia de brotes y el riesgo de transmisión de forma significativa.',
      tags: ['Crónico', 'Tratable', 'Muy frecuente'],
      transmission: 'Contacto piel con piel, también sin síntomas'
    },
    {
      name: 'Hepatitis B', emoji: '🟤',
      desc: 'Infección viral del hígado que puede cronificarse y derivar en cirrosis o cáncer hepático. Existe vacuna muy eficaz incluida en el calendario infantil. Los adultos en riesgo también pueden vacunarse.',
      tags: ['Vacuna disponible', 'Puede cronificarse', 'Grave sin tratar'],
      transmission: 'Sangre, fluidos sexuales, vertical (madre-hijo)'
    },
    {
      name: 'Hepatitis C', emoji: '🟢',
      desc: 'Se transmite principalmente por vía sanguínea. Muchas personas no saben que la tienen. Los tratamientos actuales con antivirales de acción directa logran tasas de curación superiores al 95%.',
      tags: ['Curable', 'Alta eficacia tto.', 'Vía sanguínea'],
      transmission: 'Principalmente por sangre contaminada'
    }
  ];

  flippedCard = signal<string | null>(null);
  activeSection = signal('definicion');
  private observer: IntersectionObserver | null = null;

  toggleCard(name: string) {
    this.flippedCard.update(current => current === name ? null : name);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // ITS cards stagger
    const cards = document.querySelectorAll('.its-card');
    gsap.from(cards, {
      opacity: 0, y: 30,
      duration: 0.6, stagger: 0.08, ease: 'power3.out',
      immediateRender: false,
      clearProps: 'all',
      scrollTrigger: { trigger: '#its-comunes', start: 'top 80%', once: true }
    });

    // Section observer
    this.initSectionObserver();
    setTimeout(() => ScrollTrigger.refresh(), 200);
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
