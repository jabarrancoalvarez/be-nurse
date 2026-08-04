import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EditableCard {
  id?: number;
  title: string;
  body: string;
  items: string[];
  /** Secciones propias de la card, por nombre (sintomas, tratamiento...). */
  fields: Record<string, string>;
  image: string;
  badge: string;
}

interface ContentBlockValue {
  type: string;
  value: string;
}

interface PageContent {
  blocks: Record<string, ContentBlockValue>;
  groups: Record<string, EditableCard[]>;
}

/**
 * Guarda solo lo que el administrador ha personalizado. Todo lo demas lo pinta
 * el propio build: si la API tarda o falla, la web se ve igual que siempre.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  private blocks = signal<Record<string, ContentBlockValue>>({});
  private groups = signal<Record<string, EditableCard[]>>({});
  private loadedPrefixes = new Set<string>();

  /** Se dispara al guardar para que las directivas repinten. */
  revision = signal(0);

  load(prefix: string): void {
    if (this.loadedPrefixes.has(prefix)) return;
    this.loadedPrefixes.add(prefix);

    this.http.get<PageContent>(`${this.base}/content`, { params: { prefix } })
      .pipe(catchError(() => of<PageContent>({ blocks: {}, groups: {} })))
      .subscribe(content => {
        this.blocks.update(current => ({ ...current, ...(content.blocks ?? {}) }));
        this.groups.update(current => ({ ...current, ...(content.groups ?? {}) }));
        this.revision.update(r => r + 1);
      });
  }

  /** Valor personalizado de un texto, o null si sigue el del build. */
  text(key: string): string | null {
    return this.blocks()[key]?.value ?? null;
  }

  /** URL de la imagen personalizada, o null si sigue la del build. */
  imageUrl(key: string): string | null {
    const block = this.blocks()[key];
    if (!block?.value) return null;
    return this.mediaUrl(block.value);
  }

  /**
   * Resuelve la imagen de una card: puede ser una ruta del build o, si el
   * administrador la ha sustituido, el identificador de una imagen subida.
   */
  mediaUrl(idOrPath: string): string {
    if (!idOrPath) return '';
    if (idOrPath.startsWith('assets/') || idOrPath.startsWith('http') || idOrPath.startsWith('/')) {
      return idOrPath;
    }
    return `${this.base}/media/${idOrPath}`;
  }

  /** Cards personalizadas del grupo, o null si siguen las del build. */
  cards(groupKey: string): EditableCard[] | null {
    return this.groups()[groupKey] ?? null;
  }

  saveText(key: string, value: string): Observable<void> {
    return this.http.put<void>(`${this.base}/content/blocks/${key}`, { type: 'text', value })
      .pipe(tap(() => this.setBlock(key, { type: 'text', value })));
  }

  saveImage(key: string, mediaId: string): Observable<void> {
    return this.http.put<void>(`${this.base}/content/blocks/${key}`, { type: 'image', value: mediaId })
      .pipe(tap(() => this.setBlock(key, { type: 'image', value: mediaId })));
  }

  resetBlock(key: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/content/blocks/${key}`)
      .pipe(tap(() => {
        this.blocks.update(current => {
          const next = { ...current };
          delete next[key];
          return next;
        });
        this.revision.update(r => r + 1);
      }));
  }

  saveGroup(groupKey: string, cards: EditableCard[]): Observable<EditableCard[]> {
    return this.http.put<EditableCard[]>(`${this.base}/content/groups/${groupKey}`, { cards })
      .pipe(tap(saved => {
        this.groups.update(current => ({ ...current, [groupKey]: saved }));
        this.revision.update(r => r + 1);
      }));
  }

  resetGroup(groupKey: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/content/groups/${groupKey}`)
      .pipe(tap(() => {
        this.groups.update(current => {
          const next = { ...current };
          delete next[groupKey];
          return next;
        });
        this.revision.update(r => r + 1);
      }));
  }

  /** Sube una imagen y devuelve su identificador. */
  upload(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ id: string }>(`${this.base}/media`, form).pipe(map(r => r.id));
  }

  private setBlock(key: string, value: ContentBlockValue): void {
    this.blocks.update(current => ({ ...current, [key]: value }));
    this.revision.update(r => r + 1);
  }
}
