import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Post } from '../../../../shared/models';

@Component({
  selector: 'app-post-detail-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-detail-card.html',
  styleUrl: './post-detail-card.css'
})
export class PostDetailCard {
  post = input.required<Post>();

  readonly authorName = computed(() => {
    const author = this.post().author;

    if (!author) {
      return 'Atleta desconocido';
    }

    const fullName = [author.name, author.lastname].filter(Boolean).join(' ').trim();
    return fullName || `@${author.username}`;
  });

  readonly authorUsername = computed(() => this.post().author?.username ?? 'sin-usuario');

  readonly authorInitials = computed(() => this.getInitials(this.authorName()));

  readonly formattedDate = computed(() => this.formatDate(this.post().createdAt));

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

  private getInitials(value: string): string {
    return value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
}
