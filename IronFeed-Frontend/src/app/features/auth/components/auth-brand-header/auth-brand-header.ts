import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-brand-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  },
  templateUrl: './auth-brand-header.html',
  styleUrl: './auth-brand-header.css'
})
export class AuthBrandHeader {
  homeLink = input('/');
  brandName = input('IronFeed');
  tagline = input('Fitness social');
  ariaLabel = input('Volver al feed de IronFeed');
}
