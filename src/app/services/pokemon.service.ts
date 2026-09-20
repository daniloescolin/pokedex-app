import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2';

  /**
   * Helper to extract numeric ID from PokeAPI URL:
   * e.g. "https://pokeapi.co/api/v2/pokemon/25/" -> 25
   */
  extractIdFromUrl(url: string): number {
    const segments = url.split('/').filter(Boolean);
    return Number(segments[segments.length - 1]) || 0;
  }

  /**
   * Official artwork high-res sprite URL
   */
  getArtworkUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  /**
   * Fetches a paginated list of Pokémon with offset and limit
   */
  getPokemons(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http
      .get<any>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        map((response) => ({
          count: response.count,
          next: response.next,
          previous: response.previous,
          results: response.results.map((pokemon: { name: string; url: string }) => {
            const id = this.extractIdFromUrl(pokemon.url);
            return {
              name: pokemon.name,
              url: pokemon.url,
              id,
              image: this.getArtworkUrl(id)
            };
          })
        }))
      );
  }

  getPokemonsByType(type: string): Observable<PokemonListItem[]> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`).pipe(
      map((response) =>
        response.pokemon.map((entry: { pokemon: { name: string; url: string } }) => {
          const id = this.extractIdFromUrl(entry.pokemon.url);
          return {
            name: entry.pokemon.name,
            url: entry.pokemon.url,
            id,
            image: this.getArtworkUrl(id)
          };
        })
      )
  );
  }

  /**
   * Fetches complete details (types, stats, cries, sprites) for a Pokémon by name or ID
   */
  getPokemonDetail(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${nameOrId}`);
  }
}
