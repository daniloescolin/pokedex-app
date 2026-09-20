import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'info' | 'error';

export interface AppNotification {
  message: string;
  kind: NotificationKind;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notification = signal<AppNotification | null>(null);
  private timerId?: ReturnType<typeof setTimeout>;

  show(message: string, kind: NotificationKind = 'info'): void {
    clearTimeout(this.timerId);
    this.notification.set({ message, kind });
    this.timerId = setTimeout(() => this.dismiss(), 3500);
  }

  dismiss(): void {
    this.notification.set(null);
  }
}
