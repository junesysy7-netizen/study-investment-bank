import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
  currentWage: number;
}

export default function StartScreen({ onStart, currentWage }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-line bg-surface px-6 py-12 text-center shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark sm:py-16">
      <p className="text-sm text-muted dark:text-vault-muted">
        30분 집중하면 시급 <span className="font-mono font-semibold text-ink dark:text-vault-ink">₩{Math.round(currentWage / 2).toLocaleString('ko-KR')}</span>이 입금돼요
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex h-40 w-40 items-center justify-center rounded-full bg-bank-green text-white shadow-lg shadow-bank-green/25 sm:h-48 sm:w-48"
      >
        <span className="absolute inset-0 rounded-full bg-bank-green/30 animate-ping" style={{ animationDuration: '2.5s' }} />
        <span className="relative font-display text-2xl font-semibold tracking-wide sm:text-3xl">START</span>
      </motion.button>

      <p className="max-w-xs text-xs leading-relaxed text-muted dark:text-vault-muted">
        세션이 시작되면 일시정지할 수 없어요.
        <br />
        30분을 채우면 성공, 중간에 나가면 실패로 기록돼요.
      </p>
    </div>
  );
}
