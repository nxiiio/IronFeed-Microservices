import { DestroyRef, inject, Injectable, signal } from '@angular/core';

export type ToastType = 'error' | 'success' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastsState = signal<Toast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 1;

  readonly toasts = this.toastsState.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimers());
  }

  show(toast: Omit<Toast, 'id'>, durationMs = 4500): number {
    const id = this.nextId++;
    const nextToast: Toast = { id, ...toast };

    this.toastsState.update((currentToasts) => [...currentToasts, nextToast]);
    this.scheduleDismiss(id, durationMs);

    return id;
  }

  showError(message: string, title = 'Algo salió mal'): number {
    return this.show({ type: 'error', title, message });
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.toastsState.update((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }

  clear(): void {
    this.clearTimers();
    this.toastsState.set([]);
  }

  private scheduleDismiss(id: number, durationMs: number): void {
    if (durationMs <= 0) {
      return;
    }

    const timer = setTimeout(() => this.dismiss(id), durationMs);
    this.timers.set(id, timer);
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.timers.delete(id);
  }

  private clearTimers(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
  }
}
