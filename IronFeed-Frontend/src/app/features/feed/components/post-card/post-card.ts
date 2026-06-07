import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileHoverCard } from '../../../../shared/components/profile-hover-card/profile-hover-card';
import { Post } from '../../../../shared/models';

@Component({
  selector: 'app-post-card',
  imports: [ProfileHoverCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block cursor-pointer border-b border-zinc-800/70 px-6 py-5 outline-none transition-colors hover:bg-zinc-900/35 focus-visible:bg-zinc-900/35 focus-visible:ring-4 focus-visible:ring-yellow-400/20',
    role: 'link',
    tabindex: '0',
    '(click)': 'openPostDetail()',
    '(keydown.enter)': 'openPostDetail()',
    '(keydown.space)': 'openPostDetail($event)'
  },
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  private readonly router = inject(Router);

  post = input.required<Post>();
  authorName = computed(() => {
    const author = this.post().author;

    if (!author) {
      return 'Atleta desconocido';
    }

    const fullName = `${author.name ?? ''} ${author.lastname ?? ''}`.trim();
    return fullName || `@${author.username}`;
  });

  authorUsername = computed(() => this.post().author?.username ?? 'sin-usuario');

  postTypeLabel = computed(() => {
    const labels = {
      WORKOUT: 'Workout',
      PERSONAL_RECORD: 'PR',
      PROGRESS_PHOTO: 'Foto'
    };

    return labels[this.post().type];
  });

  postTypeBadgeClass = computed(() => {
    const classes = {
      WORKOUT: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400 shadow-yellow-400/10',
      PERSONAL_RECORD: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-emerald-400/10',
      PROGRESS_PHOTO: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-cyan-400/10'
    };

    return classes[this.post().type];
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

  openPostDetail(event?: Event): void {
    event?.preventDefault();
    this.router.navigate(['/posts', this.post().id]);
  }
}
