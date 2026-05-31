import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AppUser, Post } from '../../../../shared/models';
import { ProfileHoverCard } from '../profile-hover-card/profile-hover-card';

@Component({
  selector: 'app-post-card',
  imports: [ProfileHoverCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-b border-zinc-800/70 px-6 py-5 transition-colors hover:bg-zinc-900/35'
  },
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  post = input.required<Post>();
  author = input<AppUser | null>(null);
  profileTooltipId = computed(() => `post-author-tooltip-${this.post().id}`);

  authorName = computed(() => {
    const author = this.author();

    if (!author) {
      return 'Atleta desconocido';
    }

    const fullName = `${author.name ?? ''} ${author.lastname ?? ''}`.trim();
    return fullName || `@${author.username}`;
  });

  authorUsername = computed(() => this.author()?.username ?? 'sin-usuario');

  authorInitials = computed(() =>
    this.authorName()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  );

  postTypeLabel = computed(() => {
    const labels = {
      WORKOUT: 'Workout',
      PERSONAL_RECORD: 'PR',
      PROGRESS_PHOTO: 'Foto'
    };

    return labels[this.post().type];
  });

  formattedDate = computed(() => {
    const date = new Date(this.post().createdAt);

    if (Number.isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }

    return new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  });
}
