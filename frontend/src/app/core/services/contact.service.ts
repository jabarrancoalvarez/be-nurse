import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactFormDto } from '../models/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  submit(form: ContactFormDto): Observable<void> {
    return this.http.post<void>(`${this.base}/contact`, form);
  }
}
