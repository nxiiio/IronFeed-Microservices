import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-0 block h-screen border-r border-zinc-800/80 bg-zinc-950/50 px-6 py-8 backdrop-blur-sm'
  },
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.css'
})
export class SidebarNav {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly currentUserName = computed(() => {
    const user = this.currentUser();
    const fullName = [user?.name, user?.lastname].filter(Boolean).join(' ').trim();

    return fullName || user?.username || 'Usuario IronFeed';
  });
  readonly currentUserIdentifier = computed(() => {
    const user = this.currentUser();

    return user?.username ? `@${user.username}` : user?.email ?? 'Sesión activa';
  });
  readonly currentUserInitials = computed(() =>
    this.currentUserName()
      .split(' ')
      .map((namePart) => namePart[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  );

  async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
