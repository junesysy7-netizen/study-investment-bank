import { motion } from 'framer-motion';
import { AppData, WageTier } from '../types';
import { formatCurrency, formatHoursMinutes, getTierProgress } from '../utils/wageCalculator';
import MoneyPopup from './MoneyPopup';

interface BalanceCardProps {
  data: AppData;
  tier: WageTier;
  totalHours: number;
  moneyPulse: { id: string; amount: number } | null;
}

export default function BalanceCard({ data, tier, totalHours, moneyPulse }: BalanceCardProps) {
  const progress = getTierProgress(totalHours);
  const hoursToNext = Math.max(0, tier.endHour - totalHours);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark sm:p-8">
      {/* 계좌 라벨 */}
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-medium tracking-wide text-muted dark:text-vault-muted">
          Study Investment Account
        </p>
        <span className="rounded-full bg-bank-green-soft px-2.5 py-1 text-[11px] font-medium text-bank-green dark:bg-vault-elevated dark:text-bank-glow-dark">
          미래 시급에 투자 중입니다.
        </span>
      </div>

      {/* 잔액 (가장 크게) */}
      <div className="relative mt-4">
        <MoneyPopup pulse={moneyPulse} />
        <p className="text-xs text-muted dark:text-vault-muted">통장 총액</p>
        <motion.p
          key={data.balance}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-1 font-mono text-4xl font-bold tabular-nums text-ink dark:text-vault-ink sm:text-5xl"
        >
          {formatCurrency(data.balance)}
        </motion.p>
      </div>

      {/* 시급 레벨 진행률 */}
      <div className="mt-6">
        <div className="flex items-end justify-between">
          <p className="text-xs text-muted dark:text-vault-muted">
            현재 시급 <span className="font-mono font-semibold text-ink dark:text-vault-ink">{formatCurrency(tier.wage)}</span>
          </p>
          <p className="text-xs text-muted dark:text-vault-muted">
            다음 레벨까지{' '}
            <span className="font-mono font-semibold text-bank-green dark:text-bank-glow-dark">
              {formatHoursMinutes(hoursToNext * 60)}
            </span>
          </p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper dark:bg-vault-elevated">
          <motion.div
            className="h-full rounded-full bg-bank-green dark:bg-bank-glow"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="총 공부시간" value={formatHoursMinutes(data.totalStudyMinutes)} />
        <Stat label="총 획득금액" value={formatCurrency(data.balance)} />
        <Stat label="현재 시급" value={formatCurrency(tier.wage)} />
        <Stat label="연속 기록" value={`${data.currentStreak}일`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-3 dark:bg-vault-elevated">
      <p className="text-[11px] text-muted dark:text-vault-muted">{label}</p>
      <p className="mt-0.5 truncate font-mono text-sm font-semibold text-ink dark:text-vault-ink">{value}</p>
    </div>
  );
}
