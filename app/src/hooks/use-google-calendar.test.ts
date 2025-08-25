import { expect, test, vi } from 'vitest';
import { mapEvent, performSignIn, performSignOut } from './use-google-calendar';

test('mapEvent maps Google event to internal format', () => {
  const ev = {
    id: '1',
    summary: 'Test',
    start: { dateTime: '2024-01-01T10:00:00Z' },
    end: { dateTime: '2024-01-01T11:00:00Z' },
  };
  const res = mapEvent(ev);
  expect(res.title).toBe('Test');
  expect(res.start).toBeInstanceOf(Date);
  expect(res.project).toBe('google');
});

test('performSignIn triggers auth when loaded', () => {
  const auth = { signIn: vi.fn() };
  performSignIn(auth, true);
  expect(auth.signIn).toHaveBeenCalled();
});

test('performSignIn does nothing when not loaded', () => {
  const auth = { signIn: vi.fn() };
  performSignIn(auth, false);
  expect(auth.signIn).not.toHaveBeenCalled();
});

test('performSignOut triggers auth and clears events when loaded', () => {
  const auth = { signOut: vi.fn() };
  const clear = vi.fn();
  performSignOut(auth, true, clear);
  expect(auth.signOut).toHaveBeenCalled();
  expect(clear).toHaveBeenCalled();
});

test('performSignOut does nothing when not loaded', () => {
  const auth = { signOut: vi.fn() };
  const clear = vi.fn();
  performSignOut(auth, false, clear);
  expect(auth.signOut).not.toHaveBeenCalled();
  expect(clear).not.toHaveBeenCalled();
});
