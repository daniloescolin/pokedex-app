import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  getWorkshopData() {
    return {
      title: 'Módulo de Entrenamiento PokéDex',
      description: 'Servicio y componente vinculados correctamente.',
      status: 'Activo'
    };
  }
}