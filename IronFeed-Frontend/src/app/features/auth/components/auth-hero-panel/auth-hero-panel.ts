import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-hero-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'auth-hero relative hidden min-h-[38rem] items-center justify-center overflow-hidden p-10 lg:flex'
  },
  templateUrl: './auth-hero-panel.html',
  styleUrl: './auth-hero-panel.css'
})
export class AuthHeroPanel {
  placeholderText = input('Espacio para imagen');
  ariaLabel = input('Espacio para imagen principal');
}
