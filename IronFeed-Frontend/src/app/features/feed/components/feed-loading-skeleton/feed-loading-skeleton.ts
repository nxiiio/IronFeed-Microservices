import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feed-loading-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-b border-zinc-800/80 px-6 py-6'
  },
  templateUrl: './feed-loading-skeleton.html'
})
export class FeedLoadingSkeleton {}
