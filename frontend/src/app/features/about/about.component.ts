import { Component, inject, signal, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { ContactFormDto } from '../../core/models/contact.model';
import { EditableTextDirective } from '../../shared/editable/editable-text.directive';
import { ContentService } from '../../core/services/content.service';
import { EditModeService } from '../../core/services/edit-mode.service';

@Component({
  selector: 'app-about',
  imports: [FormsModule, EditableTextDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    this.content.load('contacto');
  }
  private content = inject(ContentService);
  editMode = inject(EditModeService);

  private contactService = inject(ContactService);

  form: ContactFormDto = { name: '', email: '', subject: '', message: '' };
  submitted = signal(false);
  error = signal('');

  submit() {
    this.error.set('');
    this.contactService.submit(this.form).subscribe({
      next: () => this.submitted.set(true),
      error: () => this.error.set('Ha ocurrido un error. Por favor, intentalo de nuevo.')
    });
  }
}
