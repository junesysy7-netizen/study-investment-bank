import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { CelebrationEvent } from '../hooks/useAppState';

interface CelebrationOverlayProps {
  event: CelebrationEvent | null;
  onDismiss: () => void;
}

const ICON_BY_TYPE: Record<CelebrationEvent['type'], string> = {
  levelup: '📈',
  achievement: '🏅',
  goal: '🎯',
};

export default function CelebrationOverlay({ event, onDismiss }: CelebrationOverlayProps) {
  // 3초 후 자동으로 닫힘
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [event, onDismiss]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 px-6 backdrop-blur-sm dark:bg-black/50"
          onClick={onDismiss}
        >
          {/* 간단한 컨페티 파티클 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{
                  opacity: 0,
                  x: `${50 + (Math.random() * 40 - 20)}vw`,
                  y: '45vh',
                  scale: 0.5,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: `${20 + Math.random() * 20}vh`,
                  x: `${50 + (Math.random() * 70 - 35)}vw`,
                  rotate: Math.random() * 180 - 90,
                }}
                transition={{ duration: 1.2 + Math.random() * 0.6, ease: 'easeOut' }}
                className="absolute text-xl"
              >
                {['💰', '✨', '🪙'][i % 3]}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center gap-3 rounded-3xl border border-bank-gold/30 bg-surface px-10 py-10 text-center shadow-2xl dark:border-bank-gold-dark/30 dark:bg-vault-surface"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 12 }}
              className="text-5xl"
            >
              {ICON_BY_TYPE[event.type]}
            </motion.span>
            <p className="font-display text-xl font-bold text-ink dark:text-vault-ink">{event.title}</p>
            <p className="text-sm text-muted dark:text-vault-muted">{event.subtitle}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
