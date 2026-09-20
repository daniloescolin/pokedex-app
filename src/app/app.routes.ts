import { Routes } from '@angular/router';
import { PokemonList } from './components/pokemon-list/pokemon-list';
import { PokemonDetail } from './components/pokemon-detail/pokemon-detail';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: PokemonList },
  { path: 'pokemon/:name', component: PokemonDetail },
  { path: 'type/:type', component: PokemonList },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' } // Wildcard route for 404s
    
];