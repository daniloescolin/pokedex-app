import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonListItem } from '../../services/pokemon.service';
import { PokemonIdPipe } from '../../pipes/pokemon-id.pipe';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [RouterLink, PokemonIdPipe],
  template: `
    <div class="card pokemon-card">
      <div class="card-header">
        <span class="card-id">{{ pokemon().id | pokemonId }}</span>
        <button 
          type="button" 
          class="favorite-btn" 
          (click)="onFavoriteClick($event)"
          [class.selected]="isFavorite()"
          [title]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
          [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
          [attr.aria-pressed]="isFavorite()"
        >
          {{ isFavorite() ? '★' : '☆' }}
        </button>
      </div>

      <a [routerLink]="['/pokemon', pokemon().name]" class="card-body">
        <div class="image-wrapper">
          <img 
            [src]="pokemon().image" 
            [alt]="pokemon().name" 
            loading="lazy"
            (error)="handleImageError($event)"
          />
        </div>
        <h3 class="pokemon-name">{{ pokemon().name }}</h3>
      </a>

      <div class="card-footer">
        <a [routerLink]="['/pokemon', pokemon().name]" class="btn-detail">
          View Details →
        </a>
      </div>
    </div>
  `,
  styles: [`
    .pokemon-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #eef2f6;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }

    .pokemon-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .card-id {
      font-weight: 700;
      color: #94a3b8;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }

    .favorite-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      transition: transform 0.15s ease, background 0.15s ease;
    }

    .favorite-btn:hover {
      background: #fef3c7;
      transform: scale(1.15);
    }

    .favorite-btn.selected { color: #a16207; background: #fef3c7; border-color: #f6c344; }

    .card-body {
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .image-wrapper {
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      background: radial-gradient(circle, #f1f5f9 0%, transparent 70%);
      border-radius: 50%;
    }

    .image-wrapper img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      transition: transform 0.2s ease;
    }

    .pokemon-card:hover .image-wrapper img {
      transform: scale(1.08);
    }

    .pokemon-name {
      text-transform: capitalize;
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .card-footer {
      margin-top: 14px;
    }

    .btn-detail {
      display: block;
      text-align: center;
      background: #f1f5f9;
      color: #334155;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .btn-detail:hover {
      background: #e3350d;
      color: #ffffff;
    }
  `]
})
export class PokemonCardComponent {
  // Modern Signal Input (Angular 17+)
  pokemon = input.required<PokemonListItem>();
  isFavorite = input(false);

  // Modern Signal Output (Angular 17+)
  favorite = output<PokemonListItem>();

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favorite.emit(this.pokemon());
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Fallback to basic sprite if official artwork is missing
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon().id}.png`;
  }
}
