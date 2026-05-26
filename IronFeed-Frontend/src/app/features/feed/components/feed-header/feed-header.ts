import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feed-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block sticky top-0 z-20'
  },
  templateUrl: './feed-header.html',
  styleUrl: './feed-header.css'
})
export class FeedHeader {}
