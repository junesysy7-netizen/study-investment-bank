import { motion } from 'framer-motion';
import { getLastNMonths, sumMinutesForMonth } from '../utils/dateHelpers';
import { formatHoursMinutes } from '../utils/wageCalculator';

interface MonthlyChartProps {
  dailyMinutes: Record<string, number>;
}

export default function MonthlyChart({ dailyMinutes }: MonthlyChartProps) {
  const months = getLastNMonths(6);
  const values = months.map((m) => sumMinutesForMonth(dailyMinutes, m.key));
  const max = Math.max(60, ...values);
  const currentMonthKey = months[months.length - 1].key;
  const totalAll = values.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink dark:text-vault-ink">월간 공부 그래프</h2>
        <span className="text-xs text-muted dark:text-vault-muted">최근 6개월 {formatHoursMinutes(totalAll)}</span>
      </div>

      <div className="mt-6 flex h-32 items-end justify-between gap-2.5">
        {months.map((m, i) => {
          const minutes = values[i];
          const heightPct = Math.max(4, (minutes / max) * 100);
          const isCurrent = m.key === currentMonthKey;
          return (
            <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-full w-full items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                  className={`w-full max-w-[28px] rounded-t-md ${
                    isCurrent ? 'bg-bank-gold dark:bg-bank-gold-dark' : 'bg-bank-gold/25 dark:bg-bank-gold-dark/25'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] ${
                  isCurrent ? 'font-semibold text-ink dark:text-vault-ink' : 'text-muted dark:text-vault-muted'
                }`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
