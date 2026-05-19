import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Exercise } from '../../models';

@Component({
  selector: 'app-featured-exercises',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  },
  templateUrl: './featured-exercises.html',
  styleUrl: './featured-exercises.css'
})
export class FeaturedExercises {
  exercises = input.required<Exercise[]>();
}
