import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CursorComponent } from './shared/cursor/cursor.component';
import { PageTransitionComponent } from './shared/page-transition/page-transition.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CursorComponent, PageTransitionComponent],
  template: `
    <app-cursor />
    <app-page-transition />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    main { min-height: calc(100vh - 64px); }
  `]
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('./core/animations/lenis.config').then(({ initLenis, getLenis }) => {
        initLenis();
        this.router.events.pipe(
          filter(e => e instanceof NavigationEnd)
        ).subscribe(() => {
          getLenis()?.scrollTo(0, { immediate: true });
        });
      });
    }
  }
}
