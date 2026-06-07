import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-comment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css'
})
export class CommentForm {
  readonly maxLength = 500;

  isSubmitting = input(false);
  errorMessage = input<string | null>(null);

  commentSubmitted = output<string>();

  readonly content = signal('');
  readonly trimmedContent = computed(() => this.content().trim());
  readonly charactersUsed = computed(() => this.content().length);
  readonly canSubmit = computed(() =>
    !this.isSubmitting() &&
    this.trimmedContent().length > 0 &&
    this.charactersUsed() <= this.maxLength
  );

  updateContent(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.content.set(textarea.value);
  }

  submitComment(event: Event): void {
    event.preventDefault();

    if (!this.canSubmit()) {
      return;
    }

    this.commentSubmitted.emit(this.trimmedContent());
  }

  clearContent(): void {
    this.content.set('');
  }
}
