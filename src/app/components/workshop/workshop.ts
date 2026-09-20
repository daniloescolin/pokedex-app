import { Component, inject } from '@angular/core';
import { WorkshopService } from '../../services/workshop';

@Component({
  selector: 'app-workshop',
  standalone: true,
  templateUrl: './workshop.html',
  styleUrl: './workshop.css'
})
export class Workshop {
  private workshopService = inject(WorkshopService);
  data = this.workshopService.getWorkshopDetails();
}