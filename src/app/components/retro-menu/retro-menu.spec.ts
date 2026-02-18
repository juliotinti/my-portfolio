import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { RetroMenu } from './retro-menu';
import { AudioStore } from '../../services/audio.store';

describe('RetroMenuComponent', () => {
  let component: RetroMenu;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let audio: AudioStore;

  beforeEach(() => {
    router = {
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RetroMenu],
      providers: [
        AudioStore,
        { provide: Router, useValue: router as unknown as Router },
      ],
    });

    const fixture = TestBed.createComponent(RetroMenu);
    component = fixture.componentInstance;
    audio = TestBed.inject(AudioStore);
    fixture.detectChanges();
  });

  it('should move selection down on ArrowDown', () => {
    expect(component.selectedIndex()).toBe(0);

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(component.selectedIndex()).toBe(1);
  });

  it('should navigate to selected route on Enter', () => {
    component.selectedIndex.set(0); // New Game => /hub

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/hub');
  });

  it('should navigate to /cv on Escape', () => {
    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/cv');
  });

  it('should toggle audio on S', () => {
    const before = audio.enabled();

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'S' }));

    expect(audio.enabled()).toBe(!before);
  });
});
