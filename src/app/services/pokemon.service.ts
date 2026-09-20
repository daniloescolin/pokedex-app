import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

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

interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonSpecies {
  evolution_chain: { url: string };
}

export interface EvolutionNode {
  species: NamedApiResource;
  evolves_to: EvolutionNode[];
}

export interface EvolutionChainResponse {
  chain: EvolutionNode;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

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
      .get<{ count: number; next: string | null; previous: string | null; results: NamedApiResource[] }>(
        `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
      )
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

  getAllPokemons(): Observable<PokemonListItem[]> {
    return this.getPokemons(2000).pipe(map((response) => response.results));
  }

  getPokemonSpecies(nameOrId: string | number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.apiUrl}/pokemon-species/${nameOrId}`);
  }

  getEvolutionChain(url: string): Observable<EvolutionChainResponse> {
    return this.http.get<EvolutionChainResponse>(url);
  }

  /**
   * Fetches complete details (types, stats, cries, sprites) for a Pokémon by name or ID
   */
  getPokemonDetail(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/${nameOrId}`);
  }
}
