import { AchievementDef } from '../types';

/**
 * 업적 정의 목록.
 * thresholdHours === 0 인 항목은 "첫 세션 완료" 여부로 판정한다 (useAppState 참고).
 */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-session',
    title: '첫 발걸음',
    description: '첫 공부 세션을 완료했어요',
    thresholdHours: 0,
    icon: '🌱',
  },
  {
    id: 'hours-10',
    title: '입문 투자자',
    description: '누적 공부 10시간 달성',
    thresholdHours: 10,
    icon: '📘',
  },
  {
    id: 'hours-50',
    title: '성실한 투자자',
    description: '누적 공부 50시간 달성',
    thresholdHours: 50,
    icon: '📗',
  },
  {
    id: 'hours-100',
    title: '백단위 클럽',
    description: '누적 공부 100시간 달성',
    thresholdHours: 100,
    icon: '💼',
  },
  {
    id: 'hours-500',
    title: '베테랑 투자자',
    description: '누적 공부 500시간 달성',
    thresholdHours: 500,
    icon: '🏦',
  },
  {
    id: 'hours-1000',
    title: '레전드 투자자',
    description: '누적 공부 1000시간 달성',
    thresholdHours: 1000,
    icon: '👑',
  },
];
