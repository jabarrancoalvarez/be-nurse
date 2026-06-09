import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, ViewChildren, QueryList,
  ChangeDetectionStrategy, PLATFORM_ID, inject, signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap, ScrollTrigger } from '../../core/animations/gsap.config';
import { counterAnimation, staggerFadeIn, fadeInUp, scaleIn } from '../../core/animations/animations';

interface HeroSlide {
  pill: string;
  title: string;
  titleEm: string;
  sub: string;
  ctaLabel: string;
  ctaLink: string;
  ctaOutlineLabel: string;
  ctaOutlineLink: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('vantaHero') vantaHero!: ElementRef;
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroPill') heroPill!: ElementRef;
  @ViewChild('heroSub') heroSub!: ElementRef;
  @ViewChild('heroActions') heroActions!: ElementRef;
  @ViewChild('heroStats') heroStats!: ElementRef;
  @ViewChild('scrollProgress') scrollProgress!: ElementRef;
  @ViewChildren('pillarCard') pillarCards!: QueryList<ElementRef>;
  @ViewChildren('statNum') statNums!: QueryList<ElementRef>;
  @ViewChild('swiperEl') swiperEl!: ElementRef;
  @ViewChild('stepConnector') stepConnector!: ElementRef;

  private swiperInstance: any = null;

  statValues = [22000, 18000, 8000];

  currentSlide = signal(0);

  slides: HeroSlide[] = [
    {
      pill: 'Respaldado por profesionales de enfermería',
      title: 'BE NURSE,',
      titleEm: 'De jóvenes a jóvenes',
      sub: 'Transformamos la información en decisiones conscientes mediante educación sexual, prevención de ITS y promoción de la salud desde la Enfermería.',
      ctaLabel: 'Chat anónimo',
      ctaLink: '/chat',
      ctaOutlineLabel: 'Explorar contenidos',
      ctaOutlineLink: '/informate'
    },
    {
      pill: 'Información sexual',
      title: 'Conoce y comprende',
      titleEm: 'las ITS y tu salud',
      sub: 'Todo sobre infecciones de transmisión sexual, detección, pruebas y respuestas a las preguntas que nunca te atreviste a hacer.',
      ctaLabel: 'Explorar Infórmate',
      ctaLink: '/informate',
      ctaOutlineLabel: 'Chat anónimo',
      ctaOutlineLink: '/chat'
    },
    {
      pill: 'Prevención activa',
      title: 'Protégete de forma',
      titleEm: 'inteligente y segura',
      sub: 'Métodos de barrera, PrEP, vacunación y chequeos periódicos. Todo lo que necesitas para cuidar tu salud sexual.',
      ctaLabel: 'Explorar Cuídate',
      ctaLink: '/cuidate',
      ctaOutlineLabel: 'Chat anónimo',
      ctaOutlineLink: '/chat'
    },
    {
      pill: 'Historias y realidades',
      title: 'Sexualidad sin filtros,',
      titleEm: 'sin juicios',
      sub: 'Artículos honestos sobre porno, presión social, cuerpo e imagen. Conversaciones que necesitamos tener.',
      ctaLabel: 'Explorar Realidades',
      ctaLink: '/realidades',
      ctaOutlineLabel: 'Chat anónimo',
      ctaOutlineLink: '/chat'
    }
  ];

  get slide() { return this.slides[this.currentSlide()]; }

  prevSlide() {
    this.currentSlide.update(i => (i - 1 + this.slides.length) % this.slides.length);
    this.animateSlideChange();
  }

  nextSlide() {
    this.currentSlide.update(i => (i + 1) % this.slides.length);
    this.animateSlideChange();
  }

  goToSlide(i: number) {
    this.currentSlide.set(i);
    this.animateSlideChange();
  }

  private animateSlideChange() {
    if (!isPlatformBrowser(this.platformId)) return;
    const content = document.querySelector('.hero__content');
    if (!content) return;
    gsap.fromTo(content,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initScrollProgress();
    this.initVanta();
    this.initHeroAnimations();
    this.initPillarCards();
    this.initSteps();
    this.initSwiper();
    this.initBlogCards();
    this.initContactSection();
    setTimeout(() => ScrollTrigger.refresh(), 200);
  }

  private initScrollProgress() {
    gsap.to(this.scrollProgress.nativeElement, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  private waveCanvas: HTMLCanvasElement | null = null;
  private waveRaf = 0;

  private initVanta() {
    const el = this.vantaHero.nativeElement as HTMLElement;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    el.insertBefore(canvas, el.firstChild);
    this.waveCanvas = canvas;

    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const resize = () => {
      canvas.width = el.offsetWidth;
      canvas.height = el.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Ondas sutiles y profesionales basadas en el verde del icono #00B86B
    const waves = [
      { amp: 20, freq: 1.8, speed: 0.008, phase: 0,    alpha: 0.06, yRatio: 0.55 },
      { amp: 15, freq: 2.4, speed: 0.012, phase: 1.0,  alpha: 0.04, yRatio: 0.62 },
      { amp: 25, freq: 1.4, speed: 0.006, phase: 2.2,  alpha: 0.03, yRatio: 0.48 },
    ];


    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
          const y = H * w.yRatio
            + Math.sin((x / W) * Math.PI * w.freq + frame * w.speed + w.phase) * w.amp
            + Math.sin((x / W) * Math.PI * (w.freq * 0.6) + frame * w.speed * 0.7) * (w.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        // Verde basado en el icono #00B86B
        ctx.fillStyle = `rgba(0, 184, 107, ${w.alpha})`;
        ctx.fill();
      });

      frame++;
      this.waveRaf = requestAnimationFrame(draw);
    };

    draw();
  }

  private initHeroAnimations() {
    fadeInUp(this.heroPill.nativeElement, 0.1);
    fadeInUp(this.heroTitle.nativeElement, 0.25);
    fadeInUp(this.heroSub.nativeElement, 0.45);
    fadeInUp(this.heroActions.nativeElement, 0.6);

    const statItems = this.heroStats.nativeElement.querySelectorAll('.stat');
    staggerFadeIn(statItems, 0.15);

    import('countup.js').then(({ CountUp }) => {
      this.statNums.forEach((ref, i) => {
        const counter = new CountUp(ref.nativeElement, this.statValues[i], {
          duration: 2.5,
          separator: '.',
          prefix: '+',
          useEasing: true,
        });
        setTimeout(() => counter.start(), 600 + i * 150);
      });
    });
  }

  private initPillarCards() {
    const cards = this.pillarCards.map(r => r.nativeElement);

    gsap.from(cards, {
      opacity: 0, scale: 0.94, y: 30,
      duration: 0.7, ease: 'power3.out', stagger: 0.15,
      clearProps: 'all'
    });

    cards.forEach((card: HTMLElement) => {
      this.initCardTilt(card);
      this.initCardCursor(card);
    });
  }

  private initCardTilt(card: HTMLElement) {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateX: -y * 8,
        rotateY: x * 8,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  }

  private initCardCursor(card: HTMLElement) {
    const cursor = card.querySelector('.card-cursor') as HTMLElement;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3.out' });

    card.addEventListener('mouseenter', () => gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 }));
    card.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, scale: 0.5, duration: 0.3 }));
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      xTo(e.clientX - rect.left - 40);
      yTo(e.clientY - rect.top - 40);
    });
  }

  private initSteps() {
    const steps = document.querySelectorAll('.how__step');

    // Sin ScrollTrigger — siempre visibles
    gsap.set(steps, { opacity: 1, y: 0 });
    gsap.from(steps, {
      opacity: 0, y: 40,
      duration: 0.7, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: {
        trigger: '.how',
        start: 'top 90%',
        once: true
      }
    });

    steps.forEach((step, i) => {
      const icon = step.querySelector('.how__icon');
      if (icon) {
        (icon as HTMLElement).style.animationDelay = `${i * 0.4}s`;
      }
    });
  }

  private async initSwiper() {
    try {
      const { Swiper } = await import('swiper');
      const { FreeMode, Pagination } = await import('swiper/modules');

      this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
        modules: [FreeMode, Pagination],
        slidesPerView: 'auto' as any,
        spaceBetween: 20,
        grabCursor: true,
        freeMode: { enabled: true, momentum: true },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
          0: { slidesPerView: 1.2 },
          768: { slidesPerView: 'auto' as any }
        }
      });
    } catch {
      // Swiper fallback: normal scroll
    }
  }

  private initBlogCards() {
    const cards = document.querySelectorAll('.blog-card');
    gsap.from(cards, {
      opacity: 0, y: 30,
      duration: 0.6, ease: 'power3.out', stagger: 0.15,
      immediateRender: false,
      clearProps: 'all',
      scrollTrigger: { trigger: '.blog', start: 'top 80%', once: true }
    });

    cards.forEach((card: Element) => {
      const el = card as HTMLElement;
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        gsap.to(el.querySelector('.blog-card__body'), { x, y, duration: 0.4 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el.querySelector('.blog-card__body'), { x: 0, y: 0, duration: 0.4 });
      });
    });
  }

  private initContactSection() {
    const input = document.querySelector('.contact-cta input') as HTMLElement;
    if (input) {
      input.addEventListener('focus', () => {
        gsap.to(input, { boxShadow: '0 0 0 3px rgba(125,232,164,0.4)', duration: 0.3 });
      });
      input.addEventListener('blur', () => {
        gsap.to(input, { boxShadow: '0 0 0 0px rgba(125,232,164,0)', duration: 0.3 });
      });
    }
  }

  onCtaClick(event: MouseEvent) {
    this.createRipple(event);
  }

  private createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.className = 'btn-particle';
      particle.style.cssText = `
        position:absolute; width:8px; height:8px; border-radius:50%;
        background:rgba(125,232,164,0.8); pointer-events:none;
        left:${x}px; top:${y}px; transform:translate(-50%,-50%);
      `;
      button.appendChild(particle);
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        opacity: 0,
        scale: 2,
        duration: 0.6,
        delay: i * 0.05,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.waveRaf);
    this.waveCanvas?.remove();
    if (this.swiperInstance) this.swiperInstance.destroy();
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
