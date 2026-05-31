import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
  markers: false,
  toggleActions: 'play none none reverse'
});

export { gsap, ScrollTrigger };
