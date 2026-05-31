import { Component, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-page-transition',
  template: `<div class="page-overlay" #overlay></div>`,
  styleUrl: './page-transition.component.scss'
})
export class PageTransitionComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  @ViewChild('overlay', { static: true }) overlay!: ElementRef<HTMLDivElement>;

  private sub: any;
  private hideTimer: any;
  private isFirstNav = true;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.overlay.nativeElement;

    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.isFirstNav) {
          this.isFirstNav = false;
          return;
        }
        clearTimeout(this.hideTimer);
        el.style.transition = 'opacity 0.18s ease-in';
        el.style.opacity = '1';
      }

      if (event instanceof NavigationEnd) {
        if (this.isFirstNav) return;
        this.hideTimer = setTimeout(() => {
          el.style.transition = 'opacity 0.3s ease-out';
          el.style.opacity = '0';
        }, 200);
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.hideTimer);
    this.sub?.unsubscribe();
  }
}
