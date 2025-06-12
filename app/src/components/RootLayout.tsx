import '../styles/globals.css';
import { AppShell } from '@/components/ui/app-shell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
