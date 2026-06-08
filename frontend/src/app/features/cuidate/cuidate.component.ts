import {
  Component, OnDestroy, AfterViewInit,
  signal, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cuidate',
  templateUrl: './cuidate.component.html',
  styleUrl: './cuidate.component.scss',
  imports: [RouterLink]
})
export class CuidateComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  activeSection = signal('barrera');
  private scrollHandler: (() => void) | null = null;

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initSectionObserver();
  }

  private initSectionObserver() {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.content-section[id]')
    );

    const onScroll = () => {
      const offset = 112;
      let current = sections[0]?.id ?? 'barrera';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) current = section.id;
      }
      this.activeSection.set(current);
    };

    this.scrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  ngOnDestroy() {
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
  }
}
