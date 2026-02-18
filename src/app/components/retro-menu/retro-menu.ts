import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AudioStore } from '../../services/audio.store';

type MenuItem = Readonly<{
  label: string;
  route: string;
  hotkey?: string;
}>;


@Component({
  selector: 'app-retro-menu',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './retro-menu.html',
  styleUrl: './retro-menu.css',
})
export class RetroMenu {
private readonly router = inject(Router);
  readonly audio = inject(AudioStore);

  readonly items: readonly MenuItem[] = [
    { label: 'New Game', route: '/hub' },
    { label: 'Load Mission', route: '/missions' },
    { label: 'Inventory', route: '/inventory' },
    { label: 'View CV', route: '/cv' },
    { label: 'Contact', route: '/contact' },
  ] as const;

  readonly selectedIndex = signal<number>(0);

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    // Prevent arrow keys from scrolling the page
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter' || key === 'Escape') {
      event.preventDefault();
    }

    switch (key) {
      case 'ArrowUp':
        this.moveSelection(-1);
        break;
      case 'ArrowDown':
        this.moveSelection(1);
        break;
      case 'Enter':
        this.activate(this.selectedIndex());
        break;
      case 'Escape':
        this.skipToCv();
        break;
      case 's':
      case 'S':
        this.toggleAudio();
        break;
      default:
        this.tryHotkey(key);
        break;
    }
  }

  private moveSelection(delta: number): void {
    const len = this.items.length;
    const next = (this.selectedIndex() + delta + len) % len;
    this.selectedIndex.set(next);
  }

  private tryHotkey(key: string): void {
    const normalized = key.length === 1 ? key.toLowerCase() : key;
    const idx = this.items.findIndex(i => i.hotkey?.toLowerCase() === normalized);
    if (idx >= 0) this.activate(idx);
  }

  activate(index: number): void {
    const item = this.items[index];
    if (!item) return;
    this.selectedIndex.set(index);
    this.router.navigateByUrl(item.route);
  }

  skipToCv(): void {
    this.router.navigateByUrl('/cv');
  }

  toggleAudio(): void {
    this.audio.toggle();
  }
}
