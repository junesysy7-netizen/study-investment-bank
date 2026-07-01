import { AnimatePresence } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import StartScreen from './components/StartScreen';
import FocusMode from './components/FocusMode';
import TransactionList from './components/TransactionList';
import AchievementBadges from './components/AchievementBadges';
import WeeklyChart from './components/WeeklyChart';
import MonthlyChart from './components/MonthlyChart';
import StreakGoal, { getTodayMinutes } from './components/StreakGoal';
import CelebrationOverlay from './components/CelebrationOverlay';

export default function App() {
  const {
    data,
    currentTier,
    totalHours,
    celebration,
    moneyPulse,
    startSession,
    completeSession,
    emergencyQuit,
    setDailyGoal,
    toggleDarkMode,
    toggleSound,
    dismissCelebration,
  } = useAppState();

  const isFocusing = Boolean(data.activeSession);
  const todayMinutes = getTodayMinutes(data.dailyMinutes);

  return (
    <div className="min-h-screen bg-paper dark:bg-vault">
      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <Header
          darkMode={data.settings.darkMode}
          soundEnabled={data.settings.soundEnabled}
          onToggleDarkMode={toggleDarkMode}
          onToggleSound={toggleSound}
        />

        <main className="flex flex-col gap-5">
          <BalanceCard data={data} tier={currentTier} totalHours={totalHours} moneyPulse={moneyPulse} />

          {isFocusing ? (
            <p className="text-center text-xs text-muted dark:text-vault-muted">
              집중 세션이 진행 중이에요 — 화면을 확인하세요
            </p>
          ) : (
            <StartScreen onStart={startSession} currentWage={currentTier.wage} />
          )}

          <StreakGoal
            currentStreak={data.currentStreak}
            bestStreak={data.bestStreak}
            dailyGoalHours={data.dailyGoalHours}
            todayMinutes={todayMinutes}
            onSetGoal={setDailyGoal}
          />

          <WeeklyChart dailyMinutes={data.dailyMinutes} />
          <MonthlyChart dailyMinutes={data.dailyMinutes} />
          <AchievementBadges unlocked={data.unlockedAchievements} />
          <TransactionList transactions={data.transactions} />

          <p className="pt-2 text-center text-[11px] text-muted/70 dark:text-vault-muted/70">
            모든 기록은 이 브라우저에만 저장돼요 (LocalStorage)
          </p>
        </main>
      </div>

      <AnimatePresence>
        {isFocusing && data.activeSession && (
          <FocusMode
            key="focus-mode"
            startedAt={data.activeSession.startedAt}
            onComplete={completeSession}
            onQuit={emergencyQuit}
          />
        )}
      </AnimatePresence>

      <CelebrationOverlay event={celebration} onDismiss={dismissCelebration} />
    </div>
  );
}
