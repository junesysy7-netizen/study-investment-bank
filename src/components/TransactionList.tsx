import { motion } from 'framer-motion';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/wageCalculator';
import { formatTransactionTime } from '../utils/dateHelpers';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink dark:text-vault-ink">거래내역</h2>
        <span className="text-xs text-muted dark:text-vault-muted">{transactions.length}건</span>
      </div>

      {transactions.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-muted dark:text-vault-muted">아직 거래내역이 없어요</p>
          <p className="text-xs text-muted/70 dark:text-vault-muted/70">첫 세션을 완료하면 여기에 기록돼요</p>
        </div>
      ) : (
        <ul className="mt-4 max-h-80 space-y-1 overflow-y-auto scrollbar-thin pr-1">
          {transactions.slice(0, 100).map((tx, i) => {
            const { dayLabel, timeLabel } = formatTransactionTime(tx.timestamp);
            return (
              <motion.li
                key={tx.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 5) * 0.02 }}
                className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-2.5 hover:bg-paper dark:hover:bg-vault-elevated"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                      tx.success
                        ? 'bg-bank-green-soft text-bank-green dark:bg-vault-elevated dark:text-bank-glow-dark'
                        : 'bg-bank-danger/10 text-bank-danger dark:bg-bank-danger-dark/10 dark:text-bank-danger-dark'
                    }`}
                  >
                    {tx.success ? '↑' : '✕'}
                  </div>
                  <div>
                    <p className="text-sm text-ink dark:text-vault-ink">{tx.label}</p>
                    <p className="text-[11px] text-muted dark:text-vault-muted">
                      {dayLabel} {timeLabel}
                    </p>
                  </div>
                </div>
                <p
                  className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${
                    tx.success ? 'text-bank-green dark:text-bank-glow-dark' : 'text-bank-danger dark:text-bank-danger-dark'
                  }`}
                >
                  {tx.success ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </p>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
