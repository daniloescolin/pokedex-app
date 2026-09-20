import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    @if (notifications.notification(); as notification) {
      <div class="toast" [class]="'toast toast-' + notification.kind" role="status" aria-live="polite">
        <span>{{ notification.message }}</span>
        <button type="button" (click)="notifications.dismiss()" aria-label="Close notification">×</button>
      </div>
    }
  `,
  styles: [`
    .toast { position: fixed; right: 20px; bottom: 20px; z-index: 300; display: flex; align-items: center; gap: 18px; max-width: min(390px, calc(100vw - 40px)); padding: 14px 16px; color: #fff; background: #253045; border-left: 4px solid #f6c344; box-shadow: 0 12px 30px rgba(15, 23, 42, .2); }
    .toast-success { border-color: #22c55e; }
    .toast-error { border-color: #ef4444; }
    button { border: 0; background: transparent; color: inherit; font-size: 1.35rem; cursor: pointer; }
  `]
})
export class AppNotificationComponent {
  protected notifications = inject(NotificationService);
}
