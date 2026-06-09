import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface ContactForm {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

@Component({
  selector: 'app-admin-contacto',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-contacto.component.html',
  styleUrl: './admin-contacto.component.scss'
})
export class AdminContactoComponent implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);

  contacts = signal<ContactForm[]>([]);
  selected = signal<ContactForm | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.http.get<ContactForm[]>(`${environment.apiUrl}/admin/contacts`).subscribe({
      next: data => { this.contacts.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  select(c: ContactForm) { this.selected.set(c); }
  close() { this.selected.set(null); }
}
