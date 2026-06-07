import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-hover-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-hover-card.html',
  styleUrl: './profile-hover-card.css'
})
export class ProfileHoverCard {
  tooltipId = input.required<string>();
  fullName = input.required<string>();
  username = input.required<string>();
  placement = input<'side' | 'above'>('side');
}
