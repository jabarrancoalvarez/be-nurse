import { computed } from '@angular/core';
import { ContentService, EditableCard } from './content.service';
import { EditModeService } from './edit-mode.service';

/**
 * Grupo de cards editable. Cada pagina declara su clave y las cards que trae el
 * build; a partir de ahi el alta, la edicion, el borrado y la restauracion son
 * identicos en todas.
 *
 *   barrera = new CardGroup('cuidate.barrera.cards', defaults, this.content, this.editMode);
 */
export class CardGroup {
  /** Cards a pintar: las personalizadas si las hay, si no las del build. */
  readonly cards = computed(() => this.content.cards(this.key) ?? this.defaults);

  constructor(
    private readonly key: string,
    private readonly defaults: EditableCard[],
    private readonly content: ContentService,
    private readonly editMode: EditModeService
  ) {}

  imageOf(card: EditableCard): string {
    return this.content.mediaUrl(card.image);
  }

  updateField(index: number, field: 'title' | 'body' | 'badge', event: Event) {
    const value = ((event.target as HTMLElement).textContent ?? '').trim();
    const cards = this.clone();
    if (cards[index][field] === value) return;

    cards[index][field] = value;
    this.persist(cards);
  }

  /** Lee una seccion con nombre, con respaldo vacio. */
  field(card: EditableCard, name: string): string {
    return card.fields?.[name] ?? '';
  }

  updateNamedField(index: number, name: string, event: Event) {
    const value = ((event.target as HTMLElement).textContent ?? '').trim();
    const cards = this.clone();
    if ((cards[index].fields?.[name] ?? '') === value) return;

    cards[index].fields = { ...cards[index].fields, [name]: value };
    this.persist(cards);
  }

  updateItem(cardIndex: number, itemIndex: number, event: Event) {
    const value = ((event.target as HTMLElement).textContent ?? '').trim();
    const cards = this.clone();
    if (cards[cardIndex].items[itemIndex] === value) return;

    // Vaciar una vineta la elimina.
    if (value) cards[cardIndex].items[itemIndex] = value;
    else cards[cardIndex].items.splice(itemIndex, 1);

    this.persist(cards);
  }

  addItem(cardIndex: number) {
    const cards = this.clone();
    cards[cardIndex].items.push('Nuevo punto');
    this.persist(cards);
  }

  addCard(template?: Partial<EditableCard>) {
    const cards = this.clone();
    cards.push({
      title: 'Nueva tarjeta',
      body: 'Escribe aquí el contenido de esta tarjeta.',
      items: [],
      fields: {},
      image: '',
      badge: '',
      ...template
    });
    this.persist(cards);
  }

  removeCard(index: number) {
    if (!confirm('¿Eliminar esta tarjeta? Puedes recuperarla restaurando el grupo.')) return;

    const cards = this.clone();
    cards.splice(index, 1);
    this.persist(cards);
  }

  /** Devuelve el grupo entero a las cards del build. */
  restore() {
    if (!confirm('¿Restaurar las tarjetas originales? Se perderán los cambios de este grupo.')) return;

    this.editMode.reportSaving();
    this.content.resetGroup(this.key).subscribe({
      next: () => this.editMode.reportSaved(),
      error: () => this.editMode.reportError('No se pudo restaurar el grupo.')
    });
  }

  changeImage(index: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      this.editMode.reportSaving();
      this.content.upload(file).subscribe({
        next: id => {
          const cards = this.clone();
          cards[index].image = id;
          this.persist(cards);
        },
        error: () => this.editMode.reportError('No se pudo subir la imagen.')
      });
    });
    input.click();
  }

  private clone(): EditableCard[] {
    return this.cards().map(card => ({
      ...card,
      items: [...(card.items ?? [])],
      fields: { ...(card.fields ?? {}) }
    }));
  }

  private persist(cards: EditableCard[]) {
    this.editMode.reportSaving();
    this.content.saveGroup(this.key, cards).subscribe({
      next: () => this.editMode.reportSaved(),
      error: () => this.editMode.reportError('No se pudieron guardar las tarjetas.')
    });
  }
}
