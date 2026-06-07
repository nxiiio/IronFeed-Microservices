export type RoutinePreview = {
  id: string;
  name: string;
};

export interface WorkoutSession {
  id: string;
  userId: string;
  routine: RoutinePreview | null;
  startedAt: string;
  finishedAt: string | null;
  notes: string | null;
}

export type WorkoutSessionPreview = Pick<WorkoutSession, 'id' | 'startedAt' | 'finishedAt' | 'notes'>;
