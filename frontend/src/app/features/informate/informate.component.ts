import {
  Component, OnDestroy, AfterViewInit,
  signal, ChangeDetectionStrategy, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap, ScrollTrigger } from '../../core/animations/gsap.config';

interface ItsCard {
  name: string;
  image: string;
  queEs: string;
  sintomas: string;
  tratamiento: string;
  tags: string[];
}

@Component({
  selector: 'app-informate',
  templateUrl: './informate.component.html',
  styleUrl: './informate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformateComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  itsCards: ItsCard[] = [
    {
      name: 'VIH',
      image: 'assets/its/vih.png',
      queEs: 'El VIH es un virus que ataca el sistema inmunitario y debilita las defensas del organismo.',
      sintomas: 'Muchas personas no presentan síntomas al inicio. Los más frecuentes son fiebre, cansancio, ganglios inflamados, dolor de garganta, erupciones cutáneas y pérdida de peso.',
      tratamiento: 'Actualmente no existe cura, pero los tratamientos antirretrovirales permiten controlar el virus y llevar una vida larga y saludable.',
      tags: ['Virus', 'Crónico', 'Tratable']
    },
    {
      name: 'Trichomonas vaginalis',
      image: 'assets/its/trichomonasvaginalis.png',
      queEs: 'Infección causada por un protozoo (parásito microscópico) llamado Trichomonas vaginalis.',
      sintomas: 'Muchas personas no presentan síntomas. Cuando aparecen: flujo vaginal con mal olor, picor, irritación genital y molestias al orinar. En los hombres suele ser asintomática.',
      tratamiento: 'Tiene cura y se trata con antibióticos prescritos por un profesional sanitario.',
      tags: ['Protozoo', 'Curable', 'Frecuentemente asintomática']
    },
    {
      name: 'Herpes Simple (VHS)',
      image: 'assets/its/vhs.png',
      queEs: 'Infección causada por el Virus del Herpes Simple. El VHS-1 se asocia al herpes labial y el VHS-2 principalmente al herpes genital.',
      sintomas: 'Puede cursar sin síntomas. Cuando aparecen: vesículas o úlceras dolorosas, picor y escozor. En la primera infección puede haber fiebre, malestar e inflamación de ganglios.',
      tratamiento: 'No tiene cura definitiva, pero los antivirales controlan los síntomas, reducen los brotes y disminuyen el riesgo de transmisión.',
      tags: ['Virus', 'Crónico', 'Tratable']
    },
    {
      name: 'Papiloma Humano (VPH)',
      image: 'assets/its/vph.png',
      queEs: 'Infección causada por el Virus del Papiloma Humano. Existen más de 200 tipos; algunos afectan la zona genital.',
      sintomas: 'La mayoría no presentan síntomas y eliminan el virus de forma natural. En algunos casos provoca verrugas genitales o aumenta el riesgo de ciertos tipos de cáncer.',
      tratamiento: 'No existe tratamiento que elimine el virus, pero sí para las lesiones que produce. La vacunación es la principal medida de prevención.',
      tags: ['Virus', 'Muy frecuente', 'Vacuna']
    },
    {
      name: 'Gonorrea',
      image: 'assets/its/gonorrea.png',
      queEs: 'Infección causada por la bacteria Neisseria gonorrhoeae. Puede afectar a los genitales, el recto o la garganta.',
      sintomas: 'Muchas personas no presentan síntomas. Cuando aparecen: escozor al orinar, aumento de secreciones genitales y molestias en la zona afectada. Puede provocar faringitis o proctitis.',
      tratamiento: 'Tiene cura y se trata con antibióticos. El diagnóstico precoz ayuda a prevenir complicaciones y reducir la transmisión.',
      tags: ['Bacteria', 'Curable', 'Frecuentemente asintomática']
    },
    {
      name: 'Clamidia',
      image: 'assets/its/clamidia.png',
      queEs: 'Infección causada por la bacteria Chlamydia trachomatis. Es una de las ITS bacterianas más frecuentes, especialmente entre jóvenes.',
      sintomas: 'Muchas personas no presentan síntomas. Cuando aparecen: escozor al orinar, aumento de secreciones, sangrado entre menstruaciones o dolor durante las relaciones.',
      tratamiento: 'Tiene cura y se trata con antibióticos. El diagnóstico y tratamiento precoz previenen complicaciones como la infertilidad.',
      tags: ['Bacteria', 'Curable', 'Frecuentemente asintomática']
    },
    {
      name: 'Sífilis',
      image: 'assets/its/sifilis.png',
      queEs: 'Infección causada por la bacteria Treponema pallidum. Progresa en fases si no se trata.',
      sintomas: 'Varía según la fase. Puede comenzar con una úlcera indolora y luego provocar erupciones cutáneas, fiebre y malestar. Algunas personas no presentan síntomas durante largos periodos.',
      tratamiento: 'Tiene cura y se trata con antibióticos. El diagnóstico precoz es fundamental para evitar complicaciones graves.',
      tags: ['Bacteria', 'Curable', 'Puede pasar desapercibida']
    }
  ];

  faqs = [
    {
      q: '¿Puedo tener una ITS sin síntomas?',
      a: 'Sí. Muchas ITS pueden no dar síntomas durante un tiempo (o nunca) y aun así transmitirse. Por eso las pruebas y el uso de métodos de protección son importantes.'
    },
    {
      q: '¿El preservativo protege al 100%?',
      a: 'Reduce muchísimo el riesgo, pero no siempre lo elimina al 100%, especialmente en ITS que se transmiten por contacto piel con piel (como VPH o herpes) si hay zonas no cubiertas. Aun así, es una de las mejores herramientas de prevención.'
    },
    {
      q: '¿El sexo oral tiene riesgo?',
      a: 'Sí, puede haber riesgo de transmisión de algunas ITS. Usar preservativo o barreras de látex reduce el riesgo.'
    },
    {
      q: '¿Me da vergüenza pedir una prueba… ¿es normal?',
      a: 'Es muy común sentir vergüenza, pero pedir una prueba es un acto de autocuidado. Los profesionales sanitarios están para ayudarte sin juzgar.'
    },
    {
      q: 'Si una prueba sale positiva, ¿qué hago?',
      a: 'Busca atención sanitaria para tratamiento o seguimiento. Muchas ITS tienen tratamiento o control. Y si necesitas orientación, puedes escribirnos en el chat anónimo.'
    }
  ];

  flippedCard = signal<string | null>(null);
  openFaq = signal<number | null>(null);
  activeSection = signal('nace-benurse');
  private scrollHandler: (() => void) | null = null;

  toggleCard(name: string) {
    this.flippedCard.update(current => current === name ? null : name);
  }

  toggleFaq(i: number) {
    this.openFaq.update(current => current === i ? null : i);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const cards = document.querySelectorAll('.its-card');
    gsap.from(cards, {
      opacity: 0, y: 30,
      duration: 0.6, stagger: 0.08, ease: 'power3.out',
      immediateRender: false,
      clearProps: 'all',
      scrollTrigger: { trigger: '#its', start: 'top 80%', once: true }
    });

    this.initSectionObserver();
    setTimeout(() => ScrollTrigger.refresh(), 200);
  }

  private initSectionObserver() {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.content-section')
    );

    const onScroll = () => {
      const offset = 112;
      let current = sections[0]?.id ?? 'nace-benurse';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      }
      this.activeSection.set(current);
    };

    this.scrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  ngOnDestroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
