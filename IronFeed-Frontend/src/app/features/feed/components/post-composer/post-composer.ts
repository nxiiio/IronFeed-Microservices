import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-post-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-b border-zinc-800/70 px-6 py-5'
  },
  templateUrl: './post-composer.html',
  styleUrl: './post-composer.css'
})
export class PostComposer {}
