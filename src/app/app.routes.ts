import { Routes } from '@angular/router';
import { Workshop } from './components/workshop/workshop';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/pokemon-list/pokemon-list').then(m => m.PokemonList)
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./components/pokemon-detail/pokemon-detail').then(m => m.PokemonDetail)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'workshop',
    component: Workshop
  },
  {
    path: '**',
    redirectTo: ''
  }
];