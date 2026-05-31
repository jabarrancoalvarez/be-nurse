import { gsap, ScrollTrigger } from './gsap.config';
import { CountUp } from 'countup.js';

export function fadeInUp(element: Element | string, delay = 0): void {
  gsap.fromTo(element,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
  );
}

export function fadeInLeft(element: Element | string, delay = 0): void {
  gsap.fromTo(element,
    { opacity: 0, x: -60 },
    { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay }
  );
}

export function fadeInRight(element: Element | string, delay = 0): void {
  gsap.fromTo(element,
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay }
  );
}

export function staggerFadeIn(elements: Element[] | NodeListOf<Element> | string, stagger = 0.15): void {
  gsap.fromTo(elements,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger }
  );
}

export function scaleIn(element: Element | string, delay = 0): void {
  gsap.fromTo(element,
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay }
  );
}

export function textReveal(element: HTMLElement): void {
  const chars = element.querySelectorAll('.char');
  if (!chars.length) return;
  gsap.fromTo(chars,
    { opacity: 0, y: 100, clipPath: 'inset(0 0 100% 0)' },
    { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.out', stagger: 0.03 }
  );
}

export function counterAnimation(element: HTMLElement, endValue: number): void {
  const counter = new CountUp(element, endValue, {
    duration: 2.5,
    separator: '.',
    useEasing: true,
  });

  ScrollTrigger.create({
    trigger: element,
    start: 'top 85%',
    onEnter: () => counter.start()
  });
}

export function parallaxElement(element: Element | string, speed = 0.5): void {
  gsap.to(element, {
    y: () => -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}
