import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppData, Transaction } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { getWageTier } from '../utils/wageCalculator';
import { ACHIEVEMENTS } from '../utils/achievements';
import { todayISO, yesterdayISO } from '../utils/dateHelpers';
import { playCoinSound, playFailSound, playFanfareSound, playStartSound } from '../utils/sound';

export const SESSION_DURATION_MS = 30 * 60 * 1000; // 30분 집중 세션
const STORAGE_KEY = 'study-investment-bank/v1';

const DEFAULT_DATA: AppData = {
  totalStudyMinutes: 0,
  balance: 0,
  transactions: [],
  unlockedAchievements: {},
  currentStreak: 0,
  bestStreak: 0,
  lastStudyDateISO: null,
  dailyMinutes: {},
  dailyGoalHours: 2,
  goalCelebratedDates: [],
  settings: { darkMode: true, soundEnabled: true },
  activeSession: null,
  totalSessionsCompleted: 0,
  totalSessionsFailed: 0,
};

/** 저장된 데이터가 이전 버전이라 필드가 누락됐을 경우를 대비한 안전 병합 */
function mergeWithDefaults(stored: Partial<AppData> | null): AppData {
  if (!stored) return DEFAULT_DATA;
  return {
    ...DEFAULT_DATA,
    ...stored,
    settings: { ...DEFAULT_DATA.settings, ...(stored.settings ?? {}) },
    dailyMinutes: stored.dailyMinutes ?? {},
    transactions: stored.transactions ?? [],
    unlockedAchievements: stored.unlockedAchievements ?? {},
    goalCelebratedDates: stored.goalCelebratedDates ?? [],
  };
}

/** 이벤트 알림 (레벨업 / 업적 / 목표 달성) — CelebrationOverlay에 전달 */
export interface CelebrationEvent {
  id: string;
  type: 'levelup' | 'achievement' | 'goal';
  title: string;
  subtitle: string;
}

export function useAppState() {
  const [raw, setRaw] = useLocalStorage<AppData>(STORAGE_KEY, DEFAULT_DATA);
  const data = useMemo(() => mergeWithDefaults(raw), [raw]);

  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);
  const [moneyPulse, setMoneyPulse] = useState<{ id: string; amount: number } | null>(null);

  // 다크모드를 <html> 클래스에 반영
  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.settings.darkMode);
  }, [data.settings.darkMode]);

  const totalHours = data.totalStudyMinutes / 60;
  const currentTier = useMemo(() => getWageTier(totalHours), [totalHours]);

  // ---- 새로고침/재접속 시 진행 중 세션 자동 처리 ----
  // 세션 시작 후 30분이 이미 지났다면(탭을 닫았다 다시 연 경우 등) 자동으로 성공 처리한다.
  useEffect(() => {
    if (!data.activeSession) return;
    const elapsed = Date.now() - data.activeSession.startedAt;
    if (elapsed >= SESSION_DURATION_MS) {
      completeSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 1회만 체크

  const pushCelebration = useCallback((event: CelebrationEvent) => {
    setCelebration(event);
  }, []);

  /** 오늘 목표 달성 여부 체크 후 필요 시 축하 이벤트 큐잉 */
  const checkGoalCelebration = useCallback(
    (next: AppData) => {
      const today = todayISO();
      const todayMinutes = next.dailyMinutes[today] ?? 0;
      const goalMinutes = next.dailyGoalHours * 60;
      const alreadyCelebrated = next.goalCelebratedDates.includes(today);
      if (goalMinutes > 0 && todayMinutes >= goalMinutes && !alreadyCelebrated) {
        next.goalCelebratedDates = [...next.goalCelebratedDates, today];
        pushCelebration({
          id: `goal-${today}`,
          type: 'goal',
          title: '오늘 목표 달성!',
          subtitle: `오늘 ${next.dailyGoalHours}시간 공부를 완료했어요`,
        });
      }
    },
    [pushCelebration]
  );

  /** 세션 시작 */
  const startSession = useCallback(() => {
    if (data.activeSession) return; // 이미 진행 중이면 무시
    if (data.settings.soundEnabled) playStartSound();
    setRaw((prev) => ({
      ...mergeWithDefaults(prev),
      activeSession: { startedAt: Date.now() },
    }));
  }, [data.activeSession, data.settings.soundEnabled, setRaw]);

  /**
   * 세션 정상 완료(30분 채움) — 보상 지급 + 시급 갱신 + 스트릭/업적 체크
   *
   * 주의: React StrictMode에서는 setState의 함수형 업데이터가 두 번 호출될 수 있으므로,
   * 사운드 재생 등 부수효과가 중복 실행되지 않도록 최신 `data`를 기준으로 다음 상태를 미리
   * 계산한 뒤 setRaw(next) 형태로 한 번만 반영한다.
   */
  const completeSession = useCallback(() => {
    const prev = data;
    if (!prev.activeSession) return; // 이미 처리됨

    const prevTotalHours = prev.totalStudyMinutes / 60;
      const wageAtStart = getWageTier(prevTotalHours).wage;
      const reward = Math.round(wageAtStart / 2); // 30분 = 시급의 절반

      const newTotalMinutes = prev.totalStudyMinutes + 30;
      const today = todayISO();
      const newDailyMinutes = {
        ...prev.dailyMinutes,
        [today]: (prev.dailyMinutes[today] ?? 0) + 30,
      };

      // 스트릭 계산
      let newStreak = prev.currentStreak;
      if (prev.lastStudyDateISO === today) {
        // 오늘 이미 세션을 완료한 적 있으면 스트릭 유지
        newStreak = prev.currentStreak || 1;
      } else if (prev.lastStudyDateISO === yesterdayISO(today)) {
        newStreak = prev.currentStreak + 1;
      } else {
        newStreak = 1;
      }
      const newBestStreak = Math.max(prev.bestStreak, newStreak);

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        amount: reward,
        label: 'Study Session (30분)',
        timestamp: Date.now(),
        durationMinutes: 30,
        success: true,
      };

      const next: AppData = {
        ...prev,
        totalStudyMinutes: newTotalMinutes,
        balance: prev.balance + reward,
        transactions: [tx, ...prev.transactions],
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastStudyDateISO: today,
        dailyMinutes: newDailyMinutes,
        activeSession: null,
        totalSessionsCompleted: prev.totalSessionsCompleted + 1,
      };

      // 레벨업(시급 인상) 체크
      const oldTier = getWageTier(prevTotalHours);
      const newTier = getWageTier(newTotalMinutes / 60);
      if (newTier.index > oldTier.index) {
        pushCelebration({
          id: `levelup-${newTier.index}-${Date.now()}`,
          type: 'levelup',
          title: '시급 인상!',
          subtitle: `이제 시급 ${newTier.wage.toLocaleString('ko-KR')}원이에요`,
        });
      }

      // 업적 체크
      const newlyUnlocked: string[] = [];
      for (const ach of ACHIEVEMENTS) {
        if (next.unlockedAchievements[ach.id]) continue;
        const qualifies =
          ach.thresholdHours === 0
            ? next.totalSessionsCompleted >= 1
            : newTotalMinutes / 60 >= ach.thresholdHours;
        if (qualifies) newlyUnlocked.push(ach.id);
      }
      if (newlyUnlocked.length > 0) {
        const unlockedMap = { ...next.unlockedAchievements };
        newlyUnlocked.forEach((id) => (unlockedMap[id] = Date.now()));
        next.unlockedAchievements = unlockedMap;
        // 레벨업 축하와 겹치지 않도록, 레벨업이 없을 때만 업적 축하를 우선 표시
        if (newTier.index <= oldTier.index) {
          const firstAch = ACHIEVEMENTS.find((a) => a.id === newlyUnlocked[0])!;
          pushCelebration({
            id: `achievement-${firstAch.id}-${Date.now()}`,
            type: 'achievement',
            title: '업적 달성!',
            subtitle: `${firstAch.icon} ${firstAch.title}`,
          });
        }
      }

    checkGoalCelebration(next);

    setRaw(next);
    if (next.settings.soundEnabled) playCoinSound();
    setMoneyPulse({ id: tx.id, amount: reward });
  }, [data, checkGoalCelebration, pushCelebration, setRaw]);

  /** Emergency Quit — 세션 실패 처리 */
  const emergencyQuit = useCallback(() => {
    const prev = data;
    if (!prev.activeSession) return;

    const elapsedMinutes = Math.round((Date.now() - prev.activeSession.startedAt) / 60000);

    const tx: Transaction = {
      id: `tx-fail-${Date.now()}`,
      amount: 0,
      label: 'Emergency Quit — 세션 중단',
      timestamp: Date.now(),
      durationMinutes: Math.min(30, Math.max(0, elapsedMinutes)),
      success: false,
    };

    const next: AppData = {
      ...prev,
      transactions: [tx, ...prev.transactions],
      currentStreak: 0,
      activeSession: null,
      totalSessionsFailed: prev.totalSessionsFailed + 1,
    };

    setRaw(next);
    if (next.settings.soundEnabled) playFailSound();
  }, [data, setRaw]);

  const setDailyGoal = useCallback(
    (hours: number) => {
      setRaw((prev) => ({ ...mergeWithDefaults(prev), dailyGoalHours: hours }));
    },
    [setRaw]
  );

  const toggleDarkMode = useCallback(() => {
    setRaw((prev) => {
      const p = mergeWithDefaults(prev);
      return { ...p, settings: { ...p.settings, darkMode: !p.settings.darkMode } };
    });
  }, [setRaw]);

  const toggleSound = useCallback(() => {
    setRaw((prev) => {
      const p = mergeWithDefaults(prev);
      return { ...p, settings: { ...p.settings, soundEnabled: !p.settings.soundEnabled } };
    });
  }, [setRaw]);

  const dismissCelebration = useCallback(() => setCelebration(null), []);
  const clearMoneyPulse = useCallback(() => setMoneyPulse(null), []);

  // 업적 팡파레는 CelebrationOverlay가 마운트될 때 재생 (achievement/goal 타입 전용)
  useEffect(() => {
    if (celebration && data.settings.soundEnabled) {
      playFanfareSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebration]);

  return {
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
    clearMoneyPulse,
  };
}
