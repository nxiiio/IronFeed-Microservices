import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PersonalRecord } from '../../../../shared/models';

@Component({
  selector: 'app-post-pr-context-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-12 block'
  },
  templateUrl: './post-pr-context-panel.html',
  styleUrls: ['../post-context-panel.styles.css']
})
export class PostPrContextPanel {
  personalRecord = input.required<PersonalRecord>();
  fallbackDate = input.required<string>();

  readonly recordTitle = computed(() => this.personalRecord().exercise.name || 'Récord personal');

  readonly recordValue = computed(() => {
    const record = this.personalRecord();
    const weight = record.weightKg === null ? null : `${record.weightKg} kg`;
    const reps = record.reps === null ? null : `${record.reps} reps`;

    return [weight, reps].filter(Boolean).join(' × ') || 'Récord registrado';
  });
}
