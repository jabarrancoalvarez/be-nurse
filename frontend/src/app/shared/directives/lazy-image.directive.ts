import { Directive, ElementRef, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLImageElement>);
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const img = this.el.nativeElement;
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    const src = img.getAttribute('data-src');
    if (!src) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = src;
            img.onload = () => { img.style.opacity = '1'; };
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observer.observe(img);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
