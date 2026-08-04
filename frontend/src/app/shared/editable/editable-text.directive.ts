import {
  Directive, ElementRef, OnInit, effect, inject, input, DestroyRef, SecurityContext
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { EditModeService } from '../../core/services/edit-mode.service';

/**
 * Hace editable el texto de un elemento sin sacarlo de la plantilla: el contenido
 * que ya hay escrito en el HTML queda como valor por defecto, y solo se sustituye
 * cuando el administrador ha guardado otro. Asi la web nunca depende de la API.
 *
 *   <h1 beEditable="cuidate.hero.title">Cuídate</h1>
 */
@Directive({
  selector: '[beEditable]'
})
export class EditableTextDirective implements OnInit {
  beEditable = input.required<string>();

  private el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private content = inject(ContentService);
  private editMode = inject(EditModeService);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

  /** Contenido escrito en la plantilla: el respaldo si no hay personalizacion. */
  private fallback = '';
  private wired = false;
  /** Hasta capturar el respaldo no se pinta nada, o se borraria el texto original. */
  private ready = false;
  /** Si el DOM ya se ha reescrito alguna vez con contenido personalizado. */
  private overwritten = false;

  constructor() {
    effect(() => {
      // Depende de la revision para repintar cuando llega o cambia el contenido.
      this.content.revision();
      this.render();
    });

    effect(() => {
      const active = this.editMode.active();
      if (active) this.enableEditing();
      else this.disableEditing();
    });
  }

  ngOnInit(): void {
    this.fallback = this.el.innerHTML;
    this.ready = true;
    this.render();
  }

  private render(): void {
    if (!this.ready) return;
    // Solo se evita repintar mientras se escribe: con el foco fuera hay que
    // repintar aunque siga en modo edicion, o vaciar un texto lo dejaria vacio
    // en lugar de devolverlo al original.
    if (document.activeElement === this.el) return;

    const override = this.content.text(this.beEditable());

    // Sin personalizacion se deja el DOM intacto: reescribir el innerHTML
    // destruiria los listeners que Angular haya puesto en los hijos.
    if (override === null && !this.overwritten) return;

    const html = override ?? this.fallback;
    this.el.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
    this.overwritten = override !== null;
  }

  private enableEditing(): void {
    this.el.classList.add('be-editable');
    this.el.setAttribute('contenteditable', 'plaintext-only');
    this.el.setAttribute('title', 'Haz clic para editar este texto');

    if (this.wired) return;
    this.wired = true;

    this.el.addEventListener('blur', this.onBlur);
    this.el.addEventListener('keydown', this.onKeyDown);
    this.el.addEventListener('paste', this.onPaste);
    this.destroyRef.onDestroy(() => {
      this.el.removeEventListener('blur', this.onBlur);
      this.el.removeEventListener('keydown', this.onKeyDown);
      this.el.removeEventListener('paste', this.onPaste);
    });
  }

  private disableEditing(): void {
    this.el.classList.remove('be-editable', 'be-editable--dirty');
    this.el.removeAttribute('contenteditable');
    this.el.removeAttribute('title');
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.render();
      this.el.blur();
    }
    // Enter guarda; Shift+Enter permite salto de linea.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.el.blur();
    }
  };

  /** Pegar siempre como texto plano: evita arrastrar formato de otras webs. */
  private onPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
  };

  private onBlur = () => {
    const key = this.beEditable();
    const value = (this.el.innerHTML ?? '').trim();
    const current = this.content.text(key) ?? this.fallback;

    if (value === current.trim()) return;

    if (!value) {
      // Vaciar un texto lo devuelve al contenido original.
      this.editMode.reportSaving();
      this.content.resetBlock(key).subscribe({
        next: () => this.editMode.reportSaved(),
        error: () => {
          this.editMode.reportError('No se pudo restaurar el texto.');
          this.render();
        }
      });
      return;
    }

    this.editMode.reportSaving();
    this.content.saveText(key, value).subscribe({
      next: () => this.editMode.reportSaved(),
      error: () => {
        this.editMode.reportError('No se pudo guardar el texto.');
        this.render();
      }
    });
  };
}
