import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AppUser, PostComment } from '../../../../shared/models';

@Component({
  selector: 'app-comment-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css'
})
export class CommentCard {
  comment = input.required<PostComment>();
  author = input<AppUser | null>(null);

  readonly authorName = computed(() => {
    const author = this.author();

    if (!author) {
      return 'Atleta desconocido';
    }

    const fullName = [author.name, author.lastname].filter(Boolean).join(' ').trim();
    return fullName || `@${author.username}`;
  });

  readonly authorUsername = computed(() => this.author()?.username ?? 'sin-usuario');

  readonly formattedDate = computed(() => this.formatDate(this.comment().createdAt));

  private formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }

    return new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

}
