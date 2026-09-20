import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { EvolutionNode, PokemonListItem, PokemonService } from '../../services/pokemon.service';
import { PokemonIdPipe } from '../../pipes/pokemon-id.pipe';
import { PokemonTypeDirective } from '../../directives/pokemon-type.directive';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [RouterLink, PokemonIdPipe, PokemonTypeDirective],
  template: `
    <div class="detail-container">
      <div class="top-nav">
        <a routerLink="/" class="back-link">← Back to Pokedex</a>
      </div>

      @if (isLoading()) {
        <div class="loading-box">
          <div class="spinner"></div>
          <p>Loading Pokémon data...</p>
        </div>
      } 
      @else if (pokemon(); as poke) {
        <div class="detail-card">
          <!-- Header info -->
          <div class="header-section">
            <span class="poke-id">{{ poke.id | pokemonId }}</span>
            <h1 class="poke-name">{{ poke.name }}</h1>

            <!-- Audio Cry Player -->
            <button 
              type="button" 
              class="cry-btn" 
              [class.playing]="isPlayingSound()"
              (click)="playCry()"
              title="Listen to Pokémon Cry"
            >
              @if (isPlayingSound()) {
                <span class="sound-wave">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </span>
                <span>Playing Cry...</span>
              } @else {
                <span>🔊 Play Sound</span>
              }
            </button>
          </div>

          <!-- Types -->
          <div class="types-row">
            @for (t of poke.types; track t.type.name) {
              <span class="type-badge" [appPokemonType]="t.type.name">
                {{ t.type.name }}
              </span>
            }
          </div>

          <!-- Media: Main Artwork + Sprite Gallery -->
          <div class="media-section">
            <div class="main-artwork">
              <img 
                [src]="poke.sprites?.other?.['official-artwork']?.front_default || poke.sprites?.front_default" 
                [alt]="poke.name"
              />
            </div>

            <div class="sprites-gallery">
              @if (poke.sprites?.front_default) {
                <div class="sprite-item">
                  <img [src]="poke.sprites.front_default" alt="Normal front" />
                  <span>Default</span>
                </div>
              }
              @if (poke.sprites?.front_shiny) {
                <div class="sprite-item">
                  <img [src]="poke.sprites.front_shiny" alt="Shiny front" />
                  <span>✨ Shiny</span>
                </div>
              }
            </div>
          </div>

          <!-- Physical Profile -->
          <div class="specs-grid">
            <div class="spec-card">
              <span class="spec-label">Height</span>
              <span class="spec-value">{{ (poke.height / 10).toFixed(1) }} m</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Weight</span>
              <span class="spec-value">{{ (poke.weight / 10).toFixed(1) }} kg</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Base EXP</span>
              <span class="spec-value">{{ poke.base_experience || 'N/A' }}</span>
            </div>
          </div>

          <section class="evolution-section">
            <h2>Evolution chain</h2>
            <div class="evolution-chain">
              @for (evolution of evolutions(); track evolution.id; let last = $last) {
                <a [routerLink]="['/pokemon', evolution.name]" class="evolution-item" [class.current]="evolution.name === poke.name">
                  <img [src]="evolution.image" [alt]="evolution.name" />
                  <span>{{ evolution.name }}</span>
                </a>
                @if (!last) { <span class="evolution-arrow" aria-hidden="true">→</span> }
              } @empty {
                <p class="muted">No evolution data is available.</p>
              }
            </div>
          </section>

          <!-- Base Stats Section -->
          <div class="stats-section">
            <h2>Base Stats</h2>
            <div class="stats-list">
              @for (stat of poke.stats; track stat.stat.name) {
                <div class="stat-row">
                  <span class="stat-name">{{ formatStatName(stat.stat.name) }}</span>
                  <span class="stat-number">{{ stat.base_stat }}</span>
                  <div class="stat-bar-container">
                    <div 
                      class="stat-bar-fill"
                      [style.width.%]="getStatPercentage(stat.base_stat)"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      } 
      @else {
        <div class="error-box">
          <p>Pokémon not found or failed to load.</p>
          <a routerLink="/" class="btn-primary">Return Home</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 760px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .top-nav {
      margin-bottom: 20px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-weight: 600;
      text-decoration: none;
      padding: 8px 14px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    .back-link:hover {
      color: #e3350d;
      border-color: #e3350d;
    }

    .detail-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid #eef2f6;
    }

    .header-section {
      text-align: center;
      margin-bottom: 16px;
    }

    .poke-id {
      font-weight: 800;
      color: #94a3b8;
      font-size: 1.1rem;
      letter-spacing: 1px;
    }

    .poke-name {
      text-transform: capitalize;
      font-size: 2.2rem;
      font-weight: 800;
      color: #1e293b;
      margin: 4px 0 14px;
    }

    .cry-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      color: #1e293b;
      border: 1px solid #cbd5e1;
      border-radius: 9999px;
      padding: 8px 18px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cry-btn:hover {
      background: #e2e8f0;
      transform: scale(1.04);
    }

    .cry-btn.playing {
      background: #fee2e2;
      border-color: #fca5a5;
      color: #b91c1c;
    }

    .sound-wave {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      height: 14px;
    }

    .bar {
      width: 3px;
      height: 100%;
      background: #b91c1c;
      border-radius: 2px;
      animation: wave 0.8s infinite ease-in-out;
    }

    .bar:nth-child(2) { animation-delay: 0.2s; }
    .bar:nth-child(3) { animation-delay: 0.4s; }

    @keyframes wave {
      0%, 100% { height: 4px; }
      50% { height: 14px; }
    }

    .types-row {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 28px;
    }

    .media-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
    }

    .main-artwork {
      width: 240px;
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #f8fafc 0%, transparent 70%);
      margin-bottom: 16px;
    }

    .main-artwork img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.15));
    }

    .sprites-gallery {
      display: flex;
      gap: 24px;
    }

    .sprite-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 6px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
    }

    .sprite-item img {
      width: 64px;
      height: 64px;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 32px;
    }

    .spec-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px;
      text-align: center;
    }

    .spec-label {
      display: block;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .spec-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
    }

    .stats-section h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 16px;
    }

    .evolution-section { margin-bottom: 32px; }
    .evolution-section h2 { font-size: 1.3rem; margin-bottom: 16px; }
    .evolution-chain { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
    .evolution-item { display: flex; flex-direction: column; align-items: center; min-width: 110px; padding: 10px; border: 1px solid #e2e8f0; background: #f8fafc; text-transform: capitalize; font-weight: 700; }
    .evolution-item.current { border-color: #e3350d; background: #fff1ed; }
    .evolution-item img { width: 82px; height: 82px; object-fit: contain; }
    .evolution-arrow { color: #94a3b8; font-size: 1.4rem; }
    .muted { color: #64748b; }

    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat-row {
      display: grid;
      grid-template-columns: 100px 45px 1fr;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
    }

    .stat-name {
      font-weight: 600;
      color: #475569;
    }

    .stat-number {
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }

    .stat-bar-container {
      height: 10px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
    }

    .stat-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #ef4444);
      border-radius: 9999px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .loading-box, .error-box {
      text-align: center;
      padding: 60px 20px;
      background: #ffffff;
      border-radius: 16px;
    }

    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid #e2e8f0;
      border-top-color: #e3350d;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  private destroyRef = inject(DestroyRef);

  // State Signals
  pokemon = signal<any>(null);
  isLoading = signal<boolean>(true);
  isPlayingSound = signal<boolean>(false);
  evolutions = signal<PokemonListItem[]>([]);

  private currentAudio: HTMLAudioElement | null = null;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((params) => params.get('name')),
      tap(() => {
        this.isLoading.set(true);
        this.evolutions.set([]);
      }),
      switchMap((name) => forkJoin({
        pokemon: this.pokemonService.getPokemonDetail(name ?? ''),
        evolution: this.pokemonService.getPokemonSpecies(name ?? '').pipe(
          switchMap((species) => this.pokemonService.getEvolutionChain(species.evolution_chain.url))
        )
      })),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
        next: ({ pokemon, evolution }) => {
          this.pokemon.set(pokemon);
          this.evolutions.set(this.flattenEvolutionChain(evolution.chain));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching pokemon detail:', err);
          this.isLoading.set(false);
        }
      });
  }

  private flattenEvolutionChain(node: EvolutionNode): PokemonListItem[] {
    const id = this.pokemonService.extractIdFromUrl(node.species.url);
    return [
      { name: node.species.name, url: node.species.url, id, image: this.pokemonService.getArtworkUrl(id) },
      ...node.evolves_to.flatMap((next) => this.flattenEvolutionChain(next))
    ];
  }

  /**
   * Play the official audio cry from PokeAPI or GitHub cries fallback
   */
  playCry(): void {
    const poke = this.pokemon();
    if (!poke) return;

    // Stop currently playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // Try PokeAPI official cries URL (latest ogg) or GitHub fallback
    const audioUrl = poke.cries?.latest 
      || poke.cries?.legacy 
      || `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${poke.id}.ogg`;

    const audio = new Audio(audioUrl);
    this.currentAudio = audio;
    this.isPlayingSound.set(true);

    audio.play().catch((err) => {
      console.warn('Audio play failed:', err);
      this.isPlayingSound.set(false);
    });

    audio.onended = () => {
      this.isPlayingSound.set(false);
    };

    audio.onerror = () => {
      console.warn('Could not load audio from URL:', audioUrl);
      this.isPlayingSound.set(false);
    };
  }

  formatStatName(name: string): string {
    const map: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      'speed': 'Speed'
    };
    return map[name] || name;
  }

  getStatPercentage(value: number): number {
    const maxStat = 255;
    return Math.min(Math.round((value / maxStat) * 100), 100);
  }
}
