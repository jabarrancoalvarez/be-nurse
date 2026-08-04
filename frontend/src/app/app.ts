import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CursorComponent } from './shared/cursor/cursor.component';
import { PageTransitionComponent } from './shared/page-transition/page-transition.component';
import { EditToolbarComponent } from './shared/editable/edit-toolbar.component';
import { ContentService } from './core/services/content.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, NavbarComponent, FooterComponent, CursorComponent,
    PageTransitionComponent, EditToolbarComponent
  ],
  template: `
    <app-cursor />
    <app-page-transition />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-edit-toolbar />
  `,
  styles: [`
    main { min-height: calc(100vh - 64px); }
  `]
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private content = inject(ContentService);

  ngOnInit() {
    // El logo sale en la barra y el pie de todas las paginas.
    this.content.load('global');

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
