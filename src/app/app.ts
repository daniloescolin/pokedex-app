import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritesService } from './services/favorites.service';
import { NotificationService } from './services/notification.service';
import { AppNotificationComponent } from './components/app-notification/app-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AppNotificationComponent],
  styleUrl: './app.css',
  template: `
    <header class="app-header">
      <div class="header-container">
        <a routerLink="/" class="logo">
          <div class="pokeball-icon">
            <div class="pokeball-top"></div>
            <div class="pokeball-center"></div>
          </div>
          <div>
            <span class="logo-title">PokéDex</span>
            <span class="logo-subtitle">Angular Workshop</span>
          </div>
        </a>

        <button type="button" class="menu-button" (click)="menuOpen.update(value => !value)" aria-label="Toggle navigation">☰</button>

        <nav class="nav-links" [class.open]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
            Pokédex
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            Workshop
          </a>
          <button type="button" class="favorites-trigger" (click)="favoritesOpen.set(true); menuOpen.set(false)">
            Favorites <span>{{ favorites.count() }}</span>
          </button>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    @if (favoritesOpen()) {
      <button class="drawer-backdrop" type="button" (click)="favoritesOpen.set(false)" aria-label="Close favorites"></button>
      <aside class="favorites-drawer" aria-label="Favorite Pokémon">
        <div class="drawer-header">
          <div><span class="eyebrow">Trainer collection</span><h2>Favorites</h2></div>
          <button type="button" class="icon-button" (click)="favoritesOpen.set(false)" aria-label="Close favorites">×</button>
        </div>
        <div class="favorite-list">
          @for (pokemon of favorites.items(); track pokemon.id) {
            <div class="favorite-row">
              <a [routerLink]="['/pokemon', pokemon.name]" (click)="favoritesOpen.set(false)">
                <img [src]="pokemon.image" [alt]="pokemon.name" />
                <span>{{ pokemon.name }}</span>
              </a>
              <button type="button" (click)="removeFavorite(pokemon.id, pokemon.name)" aria-label="Remove favorite">×</button>
            </div>
          } @empty {
            <div class="drawer-empty"><span>☆</span><p>Your favorite Pokémon will appear here.</p></div>
          }
        </div>
        @if (favorites.count()) {
          <button type="button" class="clear-favorites" (click)="clearDialog.showModal()">Clear favorites</button>
        }
      </aside>
    }

    <dialog #clearDialog class="confirm-dialog">
      <h2>Clear favorites?</h2>
      <p>This removes every Pokémon from your saved collection.</p>
      <div class="dialog-actions">
        <button type="button" (click)="clearDialog.close()">Cancel</button>
        <button type="button" class="danger" (click)="clearFavorites(clearDialog)">Clear all</button>
      </div>
    </dialog>

    <footer class="app-footer">
      <div><strong>PokéDex Lab</strong><p>Explore Pokémon while learning modern Angular.</p></div>
      <div class="footer-topics"><span>Signals</span><span>RxJS</span><span>Routing</span><span>Forms</span></div>
      <p>Data provided by <a href="https://pokeapi.co" target="_blank" rel="noopener">PokeAPI</a>.</p>
    </footer>
    <app-notification />
  `
})
export class App {
  protected favorites = inject(FavoritesService);
  private notifications = inject(NotificationService);
  protected favoritesOpen = signal(false);
  protected menuOpen = signal(false);

  protected removeFavorite(id: number, name: string): void {
    this.favorites.remove(id);
    this.notifications.show(`${name} was removed from favorites.`);
  }

  protected clearFavorites(dialog: HTMLDialogElement): void {
    this.favorites.clear();
    dialog.close();
    this.favoritesOpen.set(false);
    this.notifications.show('Favorites were cleared.');
  }
}