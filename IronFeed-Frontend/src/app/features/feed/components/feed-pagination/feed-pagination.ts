import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

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
  isLoading = input(false);

  pageChange = output<number>();

  readonly visibleTotalPages = computed(() => Math.max(this.totalPages(), 1));
  readonly canGoPrevious = computed(() => this.currentPage() > 1 && !this.isLoading());
  readonly canGoNext = computed(() =>
    this.totalPages() > 0 && this.currentPage() < this.totalPages() && !this.isLoading()
  );

  goToPreviousPage(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.pageChange.emit(this.currentPage() - 1);
  }

  goToNextPage(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.pageChange.emit(this.currentPage() + 1);
  }
}
