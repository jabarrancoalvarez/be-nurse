import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { ContactFormDto } from '../../core/models/contact.model';

@Component({
  selector: 'app-about',
  imports: [FormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
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
