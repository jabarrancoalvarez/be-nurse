import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Modo edicion de la web. Solo puede activarse con sesion iniciada, y sale solo
 * al cerrar sesion para no dejar la pagina con controles de edicion colgando.
 */
@Injectable({ providedIn: 'root' })
export class EditModeService {
  private auth = inject(AuthService);

  private requested = signal(false);

  /** Verdadero solo si hay sesion y el usuario ha entrado en modo edicion. */
  active = computed(() => this.auth.isLoggedIn() && this.requested());

  /** Si puede verse el boton de "Editar pagina". */
  available = computed(() => this.auth.isLoggedIn());

  saving = signal(false);
  error = signal('');

  toggle(): void {
    this.requested.update(v => !v);
    this.error.set('');
  }

  exit(): void {
    this.requested.set(false);
  }

  reportSaving(): void {
    this.saving.set(true);
    this.error.set('');
  }

  reportSaved(): void {
    this.saving.set(false);
  }

  reportError(message: string): void {
    this.saving.set(false);
    this.error.set(message);
  }
}
