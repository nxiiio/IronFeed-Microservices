import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { CreatePostDraft, CreatePostType, WorkoutSession } from '../../../../shared/models';

@Component({
  selector: 'app-post-composer',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-b border-zinc-800/70 px-6 py-5'
  },
  templateUrl: './post-composer.html',
  styleUrl: './post-composer.css'
})
export class PostComposer {
  workoutSessions = input<WorkoutSession[]>([]);
  currentUserName = input<string | null>(null);
  isSubmitting = input(false);
  isLoadingSessions = input(false);
  errorMessage = input<string | null>(null);

  publish = output<CreatePostDraft>();

  readonly type = signal<CreatePostType>('WORKOUT');
  readonly caption = signal('');
  readonly selectedWorkoutSessionId = signal('');

  readonly isWorkout = computed(() => this.type() === 'WORKOUT');
  readonly canSubmit = computed(() => {
    if (this.isSubmitting() || this.caption().trim().length === 0) {
      return false;
    }

    return !this.isWorkout() || this.selectedWorkoutSessionId().length > 0;
  });

  setType(type: CreatePostType): void {
    this.type.set(type);

    if (type === 'PROGRESS_PHOTO') {
      this.selectedWorkoutSessionId.set('');
    }
  }

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }

    const request: CreatePostDraft = {
      type: this.type(),
      caption: this.caption().trim()
    };

    if (this.isWorkout()) {
      request.workoutSessionId = this.selectedWorkoutSessionId();
    }

    this.publish.emit(request);
  }
}
