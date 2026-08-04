import { Component, inject } from '@angular/core';
import { EditModeService } from '../../core/services/edit-mode.service';

/** Barra flotante que solo ve quien ha iniciado sesion. */
@Component({
  selector: 'app-edit-toolbar',
  template: `
    @if (editMode.available()) {
      <div class="edit-toolbar" [class.edit-toolbar--active]="editMode.active()">
        <button type="button" class="edit-toolbar__btn" (click)="editMode.toggle()">
          @if (editMode.active()) {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Terminar edición
          } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            Editar página
          }
        </button>

        @if (editMode.active()) {
          <span class="edit-toolbar__status">
            @if (editMode.saving()) {
              Guardando…
            } @else if (editMode.error()) {
              <span class="edit-toolbar__error">{{ editMode.error() }}</span>
            } @else {
              Clic en un texto o una foto para cambiarlos
            }
          </span>
        }
      </div>
    }
  `,
  styles: [`
    .edit-toolbar {
      position: fixed;
      left: 50%;
      bottom: 1.5rem;
      transform: translateX(-50%);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--color-text, #12211a);
      color: #fff;
      border-radius: 999px;
      padding: 0.6rem 0.75rem 0.6rem 0.75rem;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
      font-size: 0.875rem;
      max-width: calc(100vw - 2rem);
    }

    .edit-toolbar--active { padding-right: 1.25rem; }

    .edit-toolbar__btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-primary, #00b86b);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 0.55rem 1.1rem;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .edit-toolbar__btn:hover { filter: brightness(1.08); }

    .edit-toolbar__status {
      opacity: 0.85;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .edit-toolbar__error { color: #ff9d9d; }

    @media (max-width: 600px) {
      .edit-toolbar { flex-direction: column; gap: 0.5rem; border-radius: 20px; }
      .edit-toolbar__status { white-space: normal; text-align: center; }
    }
  `]
})
export class EditToolbarComponent {
  editMode = inject(EditModeService);
}
