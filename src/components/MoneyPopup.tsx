import { AnimatePresence, motion } from 'framer-motion';
import { formatCurrency } from '../utils/wageCalculator';

interface MoneyPopupProps {
  pulse: { id: string; amount: number } | null;
}

/** 잔액 카드 위에 떠오르는 "+₩40,000" 애니메이션 */
export default function MoneyPopup({ pulse }: MoneyPopupProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
      <AnimatePresence>
        {pulse && (
          <motion.div
            key={pulse.id}
            initial={{ opacity: 0, y: 0, scale: 0.85 }}
            animate={{ opacity: 1, y: -36, scale: 1 }}
            exit={{ opacity: 0, y: -56 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="whitespace-nowrap font-mono text-xl font-bold text-bank-green dark:text-bank-glow-dark"
          >
            +{formatCurrency(pulse.amount)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
