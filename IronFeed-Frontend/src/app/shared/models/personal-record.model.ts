import { Exercise } from './exercise.model';
import { WorkoutSessionPreview } from './workout-session.model';

export type ExercisePreview = Pick<Exercise, 'id' | 'name' | 'slug' | 'muscleGroup'>;

export interface PersonalRecord {
  id: string;
  userId: string;
  exercise: ExercisePreview;
  session: WorkoutSessionPreview;
  weightKg: number | null;
  reps: number | null;
  achievedAt: string | null;
}
