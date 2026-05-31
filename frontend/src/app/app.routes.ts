import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'informate',
    loadComponent: () => import('./features/informate/informate.component').then(m => m.InformateComponent)
  },
  {
    path: 'cuidate',
    loadComponent: () => import('./features/cuidate/cuidate.component').then(m => m.CuidateComponent)
  },
  {
    path: 'realidades',
    loadComponent: () => import('./features/realidades/realidades.component').then(m => m.RealidadesComponent)
  },
  {
    path: 'realidades/:slug',
    loadComponent: () => import('./features/realidades/realidad-detalle/realidad-detalle.component').then(m => m.RealidadDetalleComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
  },
  { path: '**', redirectTo: '' }
];
