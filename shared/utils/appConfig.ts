export interface StatusConfig {
  atRiskRangePct: number;
}

export interface WorkweekConfig {
  days: string[];
  start: string;
  end: string;
}

export interface AppConfig {
  status: StatusConfig;
  workweek: WorkweekConfig;
}

export const APP_CONFIG: AppConfig = {
  status: { atRiskRangePct: 5 },
  workweek: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '08:00', end: '17:00' },
};

export function loadWorkweekConfig(): void {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('workweek');
  if (saved) {
    try {
      APP_CONFIG.workweek = JSON.parse(saved);
    } catch {
      /* ignore invalid json */
    }
  }
}

export function saveWorkweekConfig(config: WorkweekConfig): void {
  APP_CONFIG.workweek = config;
  if (typeof window !== 'undefined') {
    localStorage.setItem('workweek', JSON.stringify(config));
  }
}
