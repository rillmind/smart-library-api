import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isCollapsed = signal<boolean>(false);

  toggle(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
