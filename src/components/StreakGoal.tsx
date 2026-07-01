import { useState } from 'react';
import { todayISO } from '../utils/dateHelpers';
import { formatHoursMinutes } from '../utils/wageCalculator';

interface StreakGoalProps {
  currentStreak: number;
  bestStreak: number;
  dailyGoalHours: number;
  todayMinutes: number;
  onSetGoal: (hours: number) => void;
}

const GOAL_PRESETS = [1, 2, 3, 4, 6, 8];

export default function StreakGoal({
  currentStreak,
  bestStreak,
  dailyGoalHours,
  todayMinutes,
  onSetGoal,
}: StreakGoalProps) {
  const [editing, setEditing] = useState(false);
  const goalMinutes = dailyGoalHours * 60;
  const progress = goalMinutes > 0 ? Math.min(1, todayMinutes / goalMinutes) : 0;
  const achieved = goalMinutes > 0 && todayMinutes >= goalMinutes;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* 스트릭 */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark">
        <h2 className="font-display text-base font-semibold text-ink dark:text-vault-ink">연속 공부 기록</h2>
        <div className="mt-4 flex items-center gap-6">
          <div>
            <p className="text-[11px] text-muted dark:text-vault-muted">현재 Streak</p>
            <p className="mt-1 font-mono text-3xl font-bold text-bank-green dark:text-bank-glow-dark">
              {currentStreak}
              <span className="ml-1 text-base font-medium text-muted dark:text-vault-muted">일</span>
            </p>
          </div>
          <div className="h-10 w-px bg-line dark:bg-vault-line" />
          <div>
            <p className="text-[11px] text-muted dark:text-vault-muted">최고 기록</p>
            <p className="mt-1 font-mono text-3xl font-bold text-ink dark:text-vault-ink">
              {bestStreak}
              <span className="ml-1 text-base font-medium text-muted dark:text-vault-muted">일</span>
            </p>
          </div>
        </div>
        {currentStreak === 0 && (
          <p className="mt-3 text-xs text-muted dark:text-vault-muted">
            오늘 세션을 완료해서 새로운 스트릭을 시작해보세요.
          </p>
        )}
      </div>

      {/* 오늘 목표 */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card dark:border-vault-line dark:bg-vault-surface dark:shadow-card-dark">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink dark:text-vault-ink">오늘 목표</h2>
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-xs font-medium text-bank-green hover:underline dark:text-bank-glow-dark"
          >
            {editing ? '닫기' : '수정'}
          </button>
        </div>

        <p className="mt-3 text-sm text-muted dark:text-vault-muted">
          {formatHoursMinutes(todayMinutes)} / {dailyGoalHours}시간
          {achieved && <span className="ml-1.5 text-bank-green dark:text-bank-glow-dark">✓ 달성</span>}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper dark:bg-vault-elevated">
          <div
            className="h-full rounded-full bg-bank-green transition-[width] duration-500 dark:bg-bank-glow"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {editing && (
          <div className="mt-4 flex flex-wrap gap-2">
            {GOAL_PRESETS.map((h) => (
              <button
                key={h}
                onClick={() => {
                  onSetGoal(h);
                  setEditing(false);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  dailyGoalHours === h
                    ? 'border-bank-green bg-bank-green-soft text-bank-green dark:border-bank-glow dark:bg-vault-elevated dark:text-bank-glow-dark'
                    : 'border-line text-ink hover:bg-paper dark:border-vault-line dark:text-vault-ink dark:hover:bg-vault-elevated'
                }`}
              >
                {h}시간
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function getTodayMinutes(dailyMinutes: Record<string, number>): number {
  return dailyMinutes[todayISO()] ?? 0;
}
