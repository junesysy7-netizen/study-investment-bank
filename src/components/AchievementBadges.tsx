import { motion } from 'framer-motion';
import { UnlockedAchievements } from '../types';
import { ACHIEVEMENTS } from '../utils/achievements';

interface AchievementBadgesProps {
  unlocked: UnlockedAchievements;
}

export default function AchievementBadges({ unlocked }: AchievementBadgesProps) {
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked[a.id]).length;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink dark:text-vault-ink">업적</h2>
        <span className="text-xs text-muted dark:text-vault-muted">
          {unlockedCount} / {ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = Boolean(unlocked[ach.id]);
          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -2 }}
              className={`group relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors ${
                isUnlocked
                  ? 'border-bank-gold/40 bg-bank-green-soft dark:border-bank-gold-dark/30 dark:bg-vault-elevated'
                  : 'border-line bg-paper opacity-50 dark:border-vault-line dark:bg-vault-elevated'
              }`}
              title={ach.description}
            >
              <span className="text-2xl" role="img" aria-label={ach.title}>
                {isUnlocked ? ach.icon : '🔒'}
              </span>
              <span className="text-[10px] font-medium leading-tight text-ink dark:text-vault-ink">
                {ach.title}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
