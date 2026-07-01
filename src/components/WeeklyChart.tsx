import { motion } from 'framer-motion';
import { getLastNDates, getWeekdayLabel, todayISO } from '../utils/dateHelpers';
import { formatHoursMinutes } from '../utils/wageCalculator';

interface WeeklyChartProps {
  dailyMinutes: Record<string, number>;
}

export default function WeeklyChart({ dailyMinutes }: WeeklyChartProps) {
  const dates = getLastNDates(7);
  const values = dates.map((d) => dailyMinutes[d] ?? 0);
  const max = Math.max(60, ...values); // 최소 1시간 스케일 보장
  const today = todayISO();
  const weekTotal = values.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink dark:text-vault-ink">주간 공부 그래프</h2>
        <span className="text-xs text-muted dark:text-vault-muted">이번 주 {formatHoursMinutes(weekTotal)}</span>
      </div>

      <div className="mt-6 flex h-32 items-end justify-between gap-2">
        {dates.map((date, i) => {
          const minutes = values[i];
          const heightPct = Math.max(4, (minutes / max) * 100);
          const isToday = date === today;
          return (
            <div key={date} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-full w-full items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
                  className={`w-full max-w-[22px] rounded-t-md ${
                    isToday ? 'bg-bank-green dark:bg-bank-glow' : 'bg-bank-green/30 dark:bg-bank-glow/25'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] ${
                  isToday
                    ? 'font-semibold text-ink dark:text-vault-ink'
                    : 'text-muted dark:text-vault-muted'
                }`}
              >
                {getWeekdayLabel(date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
