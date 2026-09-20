import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  getWorkshopDetails() {
    return {
      title: 'Taller de Angular',
      topics: ['Componentes', 'Servicios', 'Rutas']
    };
  }
}