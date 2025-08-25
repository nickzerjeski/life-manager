import { expect, test } from 'vitest';
import { mapEvent } from './use-google-calendar';

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
