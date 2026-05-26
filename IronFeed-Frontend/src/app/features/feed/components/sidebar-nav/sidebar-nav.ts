import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full border-r border-zinc-800/80 bg-zinc-950/50 px-6 py-8 backdrop-blur-sm'
  },
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.css'
})
export class SidebarNav {}
