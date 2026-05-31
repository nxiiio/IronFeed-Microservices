import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-hover-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none absolute left-14 top-0 z-30 block w-72 opacity-0 transition duration-200 ease-out group-hover/profile:opacity-100 group-focus-within/profile:opacity-100 group-hover/profile:translate-x-0 group-hover/profile:scale-100 group-focus-within/profile:translate-x-0 group-focus-within/profile:scale-100 translate-x-2 scale-95'
  },
  templateUrl: './profile-hover-card.html',
  styleUrl: './profile-hover-card.css'
})
export class ProfileHoverCard {
  tooltipId = input.required<string>();
  fullName = input.required<string>();
  username = input.required<string>();
  initials = input.required<string>();
}
