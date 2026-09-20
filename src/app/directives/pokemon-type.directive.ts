import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

const TYPE_COLORS: Record<string, string> = {
  normal: '#6d6d4e', fire: '#c2410c', water: '#2563eb', electric: '#a16207',
  grass: '#3f7d20', ice: '#287a7a', fighting: '#991b1b', poison: '#7e2280',
  ground: '#927320', flying: '#6850b8', psychic: '#c0265e', bug: '#66720e',
  rock: '#756519', ghost: '#594477', dragon: '#5425ba', dark: '#493a30',
  steel: '#6b6b7f', fairy: '#b8325c'
};

@Directive({
  selector: '[appPokemonType]',
  standalone: true
})
export class PokemonTypeDirective {
  appPokemonType = input.required<string>();
  private element = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const color = TYPE_COLORS[this.appPokemonType()] ?? '#475569';
      this.renderer.setStyle(this.element.nativeElement, 'background-color', color);
      this.renderer.setStyle(this.element.nativeElement, 'color', '#ffffff');
    });
  }
}
