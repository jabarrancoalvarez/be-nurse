import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__col">
          <div class="footer__logo">
            <img src="logo.png" alt="BE-nurse" style="width:32px;height:32px;object-fit:contain;filter:brightness(0) invert(1);" />
            BE-nurse
          </div>
          <p class="footer__desc">Plataforma de salud sexual respaldada por profesionales de enfermería. Sin juicios, con toda la información.</p>
        </div>
        <div class="footer__col">
          <h4>Navegación</h4>
          <ul>
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/informate">Infórmate</a></li>
            <li><a routerLink="/cuidate">Cuídate</a></li>
            <li><a routerLink="/realidades">Realidades</a></li>
            <li><a routerLink="/chat">Chat anónimo</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Aviso legal</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__emergency">
        Este servicio NO es una emergencia. Para emergencias médicas contacta con Screening Point o tu médico de cabecera.
      </div>
      <div class="footer__copy">
        &copy; 2026 BE-nurse. Todos los derechos reservados.
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {}
