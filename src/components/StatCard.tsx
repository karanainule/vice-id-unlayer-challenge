import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
      <div>
        <p className="font-display text-lg leading-none text-paper">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
