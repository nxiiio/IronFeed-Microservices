import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-feed-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-b border-zinc-800/80 px-6 py-5'
  },
  templateUrl: './feed-pagination.html',
  styleUrl: './feed-pagination.css'
})
export class FeedPagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalElements = input.required<number>();
  canGoPrevious = input(false);
  canGoNext = input(false);

  previousPage = output<void>();
  nextPage = output<void>();
}
