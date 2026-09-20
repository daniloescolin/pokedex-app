import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo',
  standalone: true,
  template: `
    <button
      type="button"
      class="type-badge type-{{ type() }}"
      (click)="goToType()"
      [title]="'Ver todos los Pokémon tipo ' + type()"
    >
      <img
        class="type-icon"
        [src]="iconUrl()"
        [alt]="type()"
        width="16"
        height="16"
      />
      {{ type() }}
    </button>
  `,
  styles: [`
    .type-icon {
      margin-right: 6px;
      vertical-align: middle;
      filter: brightness(0) invert(1); /* icono en blanco, ya que el SVG viene en negro */
    }
    button.type-badge {
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    button.type-badge:hover {
      transform: translateY(-1px);
      filter: brightness(1.1);
    }
  `]
})
export class Tipo {
  type = input.required<string>();
  private router = inject(Router);

  iconUrl(): string {
    return `https://cdn.jsdelivr.net/gh/partywhale/pokemon-type-icons@master/icons/${this.type()}.svg`;
  }

  goToType(): void {
    this.router.navigate(['/type', this.type()]);
  }
}