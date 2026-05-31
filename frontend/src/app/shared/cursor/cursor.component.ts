import {
  Component, OnInit, OnDestroy, ElementRef,
  ViewChild, PLATFORM_ID, inject, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cursor',
  template: `
    <div class="cursor-outer" #cursorOuter></div>
    <div class="cursor-dot" #cursorDot></div>
  `,
  styleUrl: './cursor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('cursorOuter', { static: true }) cursorOuter!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorDot', { static: true }) cursorDot!: ElementRef<HTMLDivElement>;

  private mouseX = 0;
  private mouseY = 0;
  private outerX = 0;
  private outerY = 0;
  private rafId = 0;
  private isActive = false;

  private readonly handlers = {
    mousemove: this.onMouseMove.bind(this),
    mouseenter: this.onHoverEnter.bind(this),
    mouseleave: this.onHoverLeave.bind(this),
  };

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    this.isActive = true;
    document.addEventListener('mousemove', this.handlers.mousemove);

    document.querySelectorAll('a, button, [class*="card"], .pillar-card').forEach(el => {
      el.addEventListener('mouseenter', this.handlers.mouseenter);
      el.addEventListener('mouseleave', this.handlers.mouseleave);
    });

    this.loop();
  }

  private onMouseMove(e: Event) {
    const ev = e as MouseEvent;
    this.mouseX = ev.clientX;
    this.mouseY = ev.clientY;
    const dot = this.cursorDot.nativeElement;
    dot.style.left = `${this.mouseX}px`;
    dot.style.top = `${this.mouseY}px`;
  }

  private onHoverEnter() {
    const outer = this.cursorOuter.nativeElement;
    const dot = this.cursorDot.nativeElement;
    outer.style.transform += ' scale(2.2)';
    outer.style.opacity = '0.5';
    dot.style.opacity = '0';
  }

  private onHoverLeave() {
    const outer = this.cursorOuter.nativeElement;
    const dot = this.cursorDot.nativeElement;
    outer.style.transform = outer.style.transform.replace(' scale(2.2)', '');
    outer.style.opacity = '1';
    dot.style.opacity = '1';
  }

  private loop() {
    if (!this.isActive) return;
    const lerp = 0.1;
    this.outerX += (this.mouseX - this.outerX) * lerp;
    this.outerY += (this.mouseY - this.outerY) * lerp;

    const outer = this.cursorOuter.nativeElement;
    outer.style.left = `${this.outerX}px`;
    outer.style.top = `${this.outerY}px`;

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isActive = false;
    cancelAnimationFrame(this.rafId);
    document.removeEventListener('mousemove', this.handlers.mousemove);
  }
}
