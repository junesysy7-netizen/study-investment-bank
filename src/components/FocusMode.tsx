import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SESSION_DURATION_MS } from '../hooks/useAppState';
import { formatCountdown } from '../utils/dateHelpers';

interface FocusModeProps {
  startedAt: number;
  onComplete: () => void;
  onQuit: () => void;
}

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function FocusMode({ startedAt, onComplete, onQuit }: FocusModeProps) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, SESSION_DURATION_MS - (Date.now() - startedAt))
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, SESSION_DURATION_MS - (Date.now() - startedAt));
      setRemainingMs(remaining);
      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(interval);
        onComplete();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [startedAt, onComplete]);

  const progress = 1 - remainingMs / SESSION_DURATION_MS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-paper px-6 dark:bg-vault"
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted dark:text-vault-muted">
        집중 모드
      </p>

      <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            className="stroke-line dark:stroke-vault-line"
          />
          <motion.circle
            cx="130"
            cy="130"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-bank-green dark:stroke-bank-glow"
            strokeDasharray={CIRCUMFERENCE}
            initial={false}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </svg>
        <div className="text-center">
          <p className="font-mono text-5xl font-bold tabular-nums text-ink dark:text-vault-ink sm:text-6xl">
            {formatCountdown(remainingMs)}
          </p>
          <p className="mt-2 text-xs text-muted dark:text-vault-muted">남은 시간</p>
        </div>
      </div>

      <p className="mt-8 max-w-xs text-center text-sm leading-relaxed text-muted dark:text-vault-muted">
        지금 이 시간이 미래의 시급을 올리고 있어요.
        <br />
        끝까지 채우면 잔액에 입금됩니다.
      </p>

      <button
        onClick={() => setShowConfirm(true)}
        className="mt-10 rounded-full border border-bank-danger/40 px-5 py-2.5 text-xs font-medium text-bank-danger transition-colors hover:bg-bank-danger/5 dark:border-bank-danger-dark/40 dark:text-bank-danger-dark dark:hover:bg-bank-danger-dark/10"
      >
        Emergency Quit
      </button>

      <AnimatePresence>
        {showConfirm && (
          <ConfirmQuitModal
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              onQuit();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConfirmQuitModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6 backdrop-blur-sm dark:bg-black/60"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl dark:border-vault-line dark:bg-vault-surface"
      >
        <p className="font-display text-lg font-semibold text-ink dark:text-vault-ink">정말 중단하시겠어요?</p>
        <p className="mt-2 text-sm leading-relaxed text-muted dark:text-vault-muted">
          지금 나가면 이번 세션은 <span className="font-medium text-bank-danger dark:text-bank-danger-dark">실패</span>로 기록되고, 보상을 받을 수 없어요.
          연속 기록(Streak)도 초기화됩니다.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper dark:border-vault-line dark:text-vault-ink dark:hover:bg-vault-elevated"
          >
            계속 공부하기
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-bank-danger py-2.5 text-sm font-medium text-white transition-colors hover:bg-bank-danger/90 dark:bg-bank-danger-dark dark:text-vault-surface"
          >
            세션 종료
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
