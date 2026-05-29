import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-auth-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block'
  },
  templateUrl: './auth-field.html',
  styleUrl: './auth-field.css'
})
export class AuthField {
  label = input.required<string>();
  errorMessage = input('');
  errorId = input.required<string>();
}
