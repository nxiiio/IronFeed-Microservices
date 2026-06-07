import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { WorkoutSession } from '../../../../shared/models';

@Component({
  selector: 'app-post-workout-context-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-12 block'
  },
  templateUrl: './post-workout-context-panel.html',
  styleUrls: ['../post-context-panel.styles.css']
})
export class PostWorkoutContextPanel {
  workoutSession = input.required<WorkoutSession>();

  readonly workoutTitle = computed(() => (
    this.workoutSession().routine?.name ?? 'Sesión de entrenamiento'
  ));

  readonly durationLabel = computed(() => {
    const session = this.workoutSession();
    const finishedAtValue = session.finishedAt;
    const startedAt = new Date(session.startedAt).getTime();
    const finishedAt = finishedAtValue ? new Date(finishedAtValue).getTime() : null;

    if (!finishedAt) {
      return 'En curso';
    }

    if (Number.isNaN(startedAt) || Number.isNaN(finishedAt) || finishedAt <= startedAt) {
      return 'Duración no disponible';
    }

    const totalMinutes = Math.round((finishedAt - startedAt) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} h ${minutes} min`;
    }

    if (hours > 0) {
      return `${hours} h`;
    }

    return `${minutes} min`;
  });
}
