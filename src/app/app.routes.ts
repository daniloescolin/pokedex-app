import { Routes } from '@angular/router';
import { PokemonList } from './components/pokemon-list/pokemon-list';
import { PokemonDetail } from './components/pokemon-detail/pokemon-detail';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { PokemonType } from './components/pokemon-type/pokemon-type';

export const routes: Routes = [
  {
    path: '',
    component: PokemonList
  },
  {
    path: 'pokemon/:name',
    component: PokemonDetail
  },
  {
    path: 'tipo',
    component: PokemonType
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];