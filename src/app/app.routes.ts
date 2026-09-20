import { Routes } from '@angular/router';
import { PokemonList } from './components/pokemon-list/pokemon-list';
import { PokemonDetail } from './components/pokemon-detail/pokemon-detail';
import { Dashboard } from './components/dashboard/dashboard';
import { Workshop } from './components/workshop/workshop'; // 1. Importación del nuevo componente
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: PokemonList },
  { path: 'pokemon/:name', component: PokemonDetail },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard] // Apply the guard here
  },
  { 
    path: 'workshop', 
    component: Workshop // 2. Nueva ruta agregada
  },
  { path: '**', redirectTo: '' } // Wildcard route for 404s (debe ir siempre al final)
];