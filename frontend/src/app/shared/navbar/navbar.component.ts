import {
  Component, OnInit, OnDestroy, HostListener, signal, inject, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { gsap } from '../../core/animations/gsap.config';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  private router = inject(Router);
  private el = inject(ElementRef);

  scrolled = signal(false);
  menuOpen = signal(false);
  currentRoute = signal('');

  @ViewChild('menuList') menuList!: ElementRef;
  @ViewChild('logoEl') logoEl!: ElementRef;

  private routerSub: any;

  ngOnInit() {
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentRoute.set(e.urlAfterRedirects);
      if (this.menuOpen()) this.closeMenu();
    });
  }

  ngAfterViewInit() {
    gsap.to(this.logoEl.nativeElement, {
      scale: 1.03,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    if (this.menuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menuOpen.set(true);
    const items = this.menuList?.nativeElement?.querySelectorAll('li');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out' }
      );
    }
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
