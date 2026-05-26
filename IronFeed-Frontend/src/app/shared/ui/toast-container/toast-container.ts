import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService, type ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents'
  },
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);

  readonly toasts = this.toastService.toasts;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  toastClasses(type: ToastType): string {
    const baseClasses =
      'toast-card pointer-events-auto overflow-hidden rounded-3xl border bg-zinc-950/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl';

    if (type === 'error') {
      return `${baseClasses} border-red-500/40`;
    }

    if (type === 'success') {
      return `${baseClasses} border-lime-400/40`;
    }

    return `${baseClasses} border-yellow-400/40`;
  }

  iconClasses(type: ToastType): string {
    const baseClasses =
      'grid size-9 shrink-0 place-items-center rounded-2xl text-sm font-black ring-1';

    if (type === 'error') {
      return `${baseClasses} bg-red-500/15 text-red-300 ring-red-500/30`;
    }

    if (type === 'success') {
      return `${baseClasses} bg-lime-400/15 text-lime-300 ring-lime-400/30`;
    }

    return `${baseClasses} bg-yellow-400/15 text-yellow-300 ring-yellow-400/30`;
  }

  iconFor(type: ToastType): string {
    if (type === 'error') {
      return '!';
    }

    if (type === 'success') {
      return '✓';
    }

    return 'i';
  }
}
