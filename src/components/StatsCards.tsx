import { QuoteStatus } from "@prisma/client";
import { quoteStatusLabel } from "@/lib/utils";

type Stat = {
  label: string;
  value: number;
  delta?: string;
};

type FunnelEntry = {
  status: QuoteStatus;
  value: number;
};

export function StatsCards({
  stats,
  funnel
}: {
  stats: Stat[];
  funnel: FunnelEntry[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <span className="text-sm text-slate-500">{stat.label}</span>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</div>
          {stat.delta ? <p className="mt-1 text-xs text-emerald-600">{stat.delta}</p> : null}
        </div>
      ))}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card md:col-span-2">
        <h4 className="text-sm font-semibold text-slate-600">Embudo</h4>
        <div className="mt-4 space-y-3">
          {funnel.map((entry) => (
            <div key={entry.status} className="flex items-center justify-between text-sm">
              <span>{quoteStatusLabel(entry.status)}</span>
              <span className="font-semibold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
