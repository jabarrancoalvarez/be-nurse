import {
  Component, ElementRef, OnDestroy, AfterViewInit,
  signal, input, viewChild, effect, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

let nextId = 0;

/**
 * Tarjeta de dos caras que gira al pulsar. La cara frontal gira desde cualquier
 * punto; el reverso solo desde su boton, para poder leer y seleccionar el texto
 * sin girarla sin querer.
 */
@Component({
  selector: 'app-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrl: './flip-card.component.scss'
})
export class FlipCardComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  frontLabel = input('Saber más');
  backLabel = input('Volver');

  /** Proporcion maxima de la ventana que puede ocupar la tarjeta girada. */
  maxHeightRatio = input(0.8);

  protected panelId = `flip-card-panel-${nextId++}`;
  protected flipped = signal(false);

  /**
   * Altura solo mientras esta girada: el reverso suele ser mucho mas largo que
   * el frente. Sin girar se deja en null para que la tarjeta ocupe su hueco y
   * una fila de tarjetas quede pareja.
   */
  protected height = signal<number | null>(null);

  private front = viewChild<ElementRef<HTMLElement>>('front');
  private back = viewChild<ElementRef<HTMLElement>>('back');
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      this.flipped();
      this.measure();
    });
  }

  protected toggle() {
    this.flipped.update(flipped => !flipped);
  }

  private measure() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.flipped()) {
      this.height.set(null);
      return;
    }

    const back = this.back()?.nativeElement;
    if (!back) return;

    // El reverso puede ser largo: se limita a la pantalla y se desplaza por dentro.
    const max = Math.round(window.innerHeight * this.maxHeightRatio());
    this.height.set(Math.min(back.scrollHeight, max));
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const front = this.front()?.nativeElement;
    const back = this.back()?.nativeElement;
    if (!front || !back) return;

    // La altura de cada cara cambia al reflujar el texto (rotacion, zoom, resize).
    this.resizeObserver = new ResizeObserver(() => this.measure());
    this.resizeObserver.observe(front);
    this.resizeObserver.observe(back);

    this.measure();
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
