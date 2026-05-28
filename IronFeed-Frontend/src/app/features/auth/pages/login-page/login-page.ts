import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../../core/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen'
  },
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberSession: [false]
  });

  get emailErrorMessage(): string {
    const email = this.loginForm.controls.email;

    if (!this.shouldShowError(email)) {
      return '';
    }

    if (email.hasError('required')) {
      return 'El email es obligatorio.';
    }

    if (email.hasError('email')) {
      return 'Ingresa un email válido.';
    }

    return '';
  }

  get passwordErrorMessage(): string {
    const password = this.loginForm.controls.password;

    if (!this.shouldShowError(password)) {
      return '';
    }

    if (password.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }

    if (password.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    return '';
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberSession } = this.loginForm.getRawValue();

    this.isLoading.set(true);

    try {
      await firstValueFrom(this.authService.login({ email, password }, rememberSession));
      await this.router.navigateByUrl('/');
    } catch {
      this.errorMessage.set('No pudimos iniciar sesión. Revisa tus credenciales e intenta nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private shouldShowError(control: { invalid: boolean; touched: boolean; dirty: boolean }): boolean {
    return control.invalid && (control.touched || control.dirty);
  }
}
