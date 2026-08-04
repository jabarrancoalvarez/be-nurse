import {
  Component, OnDestroy, AfterViewInit, OnInit,
  signal, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlipCardComponent } from '../../shared/flip-card/flip-card.component';
import { EditableTextDirective } from '../../shared/editable/editable-text.directive';
import { EditableImageDirective } from '../../shared/editable/editable-image.directive';
import { ContentService, EditableCard } from '../../core/services/content.service';
import { CardGroup } from '../../core/services/card-group';
import { EditModeService } from '../../core/services/edit-mode.service';

@Component({
  selector: 'app-cuidate',
  templateUrl: './cuidate.component.html',
  styleUrl: './cuidate.component.scss',
  imports: [RouterLink, FlipCardComponent, EditableTextDirective, EditableImageDirective]
})
export class CuidateComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private content = inject(ContentService);
  editMode = inject(EditModeService);

  activeSection = signal('barrera');
  private scrollHandler: (() => void) | null = null;

  /** Clave del grupo de cards de metodos de barrera. */
  readonly barreraKey = 'cuidate.barrera.cards';

  /** Cards escritas en el build: se usan mientras el administrador no las cambie. */
  private readonly barreraDefaults: EditableCard[] = [
    {
      title: 'Preservativo masculino',
      body: 'Con uso correcto, eficacia del 98% frente a ITS y embarazo. Úsalo desde el inicio, no solo al final.',
      items: [
        'Comprobar la fecha de caducidad',
        'Abrir con cuidado, sin uñas ni dientes',
        'Dejar espacio en la punta',
        'Lubricante base acuosa o silicona'
      ],
      fields: {},
      image: 'assets/metodos-barrera/preservativo-masculino.jpg',
      badge: ''
    },
    {
      title: 'Preservativo femenino',
      body: 'También llamado femidom, puede colocarse hasta 8 horas antes. Da autonomía a quien lo usa.',
      items: [
        'Eficacia similar al masculino con uso correcto',
        'Compatible con lubricantes de todo tipo',
        'Disponible en farmacias y centros de salud sexual'
      ],
      fields: {},
      image: 'assets/metodos-barrera/preservativo-femenino.jpg',
      badge: ''
    },
    {
      title: 'Dental dam',
      body: 'Lámina de látex para el sexo oral. Protege frente a gonorrea, herpes y VPH en prácticas orales.',
      items: [
        'Se puede fabricar cortando un preservativo masculino',
        'Colocar entre la boca y la zona genital o anal',
        'No reutilizar'
      ],
      fields: {},
      image: 'assets/metodos-barrera/dental-dam.jpg',
      badge: ''
    }
  ];

  barrera = new CardGroup(this.barreraKey, this.barreraDefaults, this.content, this.editMode);

  ngOnInit() {
    this.content.load('cuidate');
  }

  /* NAVEGACION */

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initSectionObserver();
  }

  private initSectionObserver() {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.content-section[id]')
    );

    const onScroll = () => {
      const offset = 112;
      let current = sections[0]?.id ?? 'barrera';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) current = section.id;
      }
      this.activeSection.set(current);
    };

    this.scrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  ngOnDestroy() {
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
  }
}
