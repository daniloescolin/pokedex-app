import { Injectable, computed, signal } from '@angular/core';
import { PokemonListItem } from './pokemon.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storageKey = 'pokedex-favorites';
  private readonly itemsState = signal<PokemonListItem[]>(this.readStorage());

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() => this.itemsState().length);

  toggle(pokemon: PokemonListItem): boolean {
    const exists = this.isFavorite(pokemon.id);
    this.itemsState.update((items) =>
      exists ? items.filter((item) => item.id !== pokemon.id) : [...items, pokemon]
    );
    this.persist();
    return !exists;
  }

  remove(id: number): void {
    this.itemsState.update((items) => items.filter((item) => item.id !== id));
    this.persist();
  }

  clear(): void {
    this.itemsState.set([]);
    this.persist();
  }

  isFavorite(id: number): boolean {
    return this.itemsState().some((item) => item.id === id);
  }

  private readStorage(): PokemonListItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
    } catch {
      return [];
    }
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.itemsState()));
  }
}
