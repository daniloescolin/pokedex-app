import { Component, input } from '@angular/core';

const TYPE_COLORS: Record<string, string> = {
  normal: '#6d6d4e',
  fire: '#c2410c',
  water: '#2563eb',
  electric: '#a16207',
  grass: '#3f7d20',
  ice: '#287a7a',
  fighting: '#991b1b',
  poison: '#7e2280',
  ground: '#927320',
  flying: '#6850b8',
  psychic: '#c0265e',
  bug: '#66720e',
  rock: '#756519',
  ghost: '#594477',
  dragon: '#5425ba',
  dark: '#493a30',
  steel: '#6b6b7f',
  fairy: '#b8325c'
};

@Component({
  selector: 'app-pokemon-type',
  imports: [],
  templateUrl: './pokemon-type.html',
  styleUrl: './pokemon-type.css'
})
export class PokemonType {

  type = input<string>('normal');

  get color(): string {
    return TYPE_COLORS[this.type()] ?? '#475569';
  }

}