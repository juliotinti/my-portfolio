import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'architect-hub:audioEnabled:v1';

function readBool(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === 'true';
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean): void {
    localStorage.setItem(key, String(value));
}

@Injectable({
  providedIn: 'root'
})
export class AudioStore {
  readonly enabled = signal<boolean>(readBool(STORAGE_KEY, true));

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    writeBool(STORAGE_KEY, next);
  }

  setEnabled(value: boolean): void {
    this.enabled.set(value);
    writeBool(STORAGE_KEY, value);
  }
}