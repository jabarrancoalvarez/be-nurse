import {
  Directive, ElementRef, OnInit, effect, inject, input, DestroyRef
} from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { EditModeService } from '../../core/services/edit-mode.service';

/** Tope de ancho al subir: evita mandar fotos de movil de varios megas. */
const MAX_WIDTH = 1600;
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Permite sustituir la imagen de un <img> sin tocar la plantilla. El src escrito
 * en el HTML queda como valor por defecto.
 *
 *   <img beEditableImage="cuidate.barrera.foto" src="assets/..." alt="...">
 */
@Directive({
  selector: 'img[beEditableImage]'
})
export class EditableImageDirective implements OnInit {
  beEditableImage = input.required<string>();

  private el = inject(ElementRef<HTMLImageElement>).nativeElement as HTMLImageElement;
  private content = inject(ContentService);
  private editMode = inject(EditModeService);
  private destroyRef = inject(DestroyRef);

  private fallback = '';
  private wired = false;
  /** Hasta capturar el src original no se pinta nada, o se vaciaria la imagen. */
  private ready = false;

  constructor() {
    effect(() => {
      this.content.revision();
      this.render();
    });

    effect(() => {
      if (this.editMode.active()) this.enableEditing();
      else this.disableEditing();
    });
  }

  ngOnInit(): void {
    this.fallback = this.el.getAttribute('src') ?? '';
    this.ready = true;
    this.render();
  }

  private render(): void {
    if (!this.ready) return;

    const url = this.content.imageUrl(this.beEditableImage()) ?? this.fallback;
    if (this.el.getAttribute('src') !== url) {
      this.el.setAttribute('src', url);
    }
  }

  private enableEditing(): void {
    this.el.classList.add('be-editable-image');
    this.el.setAttribute('title', 'Haz clic para cambiar esta imagen');

    if (this.wired) return;
    this.wired = true;

    this.el.addEventListener('click', this.onClick);
    this.destroyRef.onDestroy(() => this.el.removeEventListener('click', this.onClick));
  }

  private disableEditing(): void {
    this.el.classList.remove('be-editable-image');
    this.el.removeAttribute('title');
  }

  private onClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (file) await this.upload(file);
    });
    input.click();
  };

  private async upload(file: File): Promise<void> {
    this.editMode.reportSaving();

    try {
      const resized = await shrink(file);

      if (resized.size > MAX_BYTES) {
        this.editMode.reportError('La imagen es demasiado grande, incluso reducida.');
        return;
      }

      this.content.upload(resized).subscribe({
        next: id => {
          this.content.saveImage(this.beEditableImage(), id).subscribe({
            next: () => this.editMode.reportSaved(),
            error: () => this.editMode.reportError('La imagen se subió pero no se pudo asignar.')
          });
        },
        error: () => this.editMode.reportError('No se pudo subir la imagen.')
      });
    } catch {
      this.editMode.reportError('No se pudo procesar la imagen.');
    }
  }
}

/**
 * Reduce la imagen en el navegador antes de subirla. Ahorra ancho de banda y
 * evita guardar en la base de datos fotos mucho mayores de lo que se ve.
 */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);

  if (bitmap.width <= MAX_WIDTH) {
    bitmap.close();
    return file;
  }

  const width = MAX_WIDTH;
  const height = Math.round((bitmap.height * MAX_WIDTH) / bitmap.width);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, 'image/jpeg', 0.85)
  );

  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}
