import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokemonId',
  standalone: true
})
export class PokemonIdPipe implements PipeTransform {
  /**
   * Formats a Pokemon ID number into classic Pokedex notation:
   * 1 -> #001, 25 -> #025, 150 -> #150
   */
  transform(value: number | string | null | undefined, padLength: number = 3): string {
    if (value === null || value === undefined) return '#000';
    const numStr = value.toString();
    return `#${numStr.padStart(padLength, '0')}`;
  }
}
