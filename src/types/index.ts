// ============================================================
// Study Investment Bank — 전역 타입 정의
// ============================================================

/** 통장 거래내역 한 건 */
export interface Transaction {
  id: string;
  /** 입금액 (실패 세션은 0) */
  amount: number;
  /** "Study Session (30분)" 또는 "Emergency Quit" 등 표시용 라벨 */
  label: string;
  /** 발생 시각 (epoch ms) */
  timestamp: number;
  /** 세션 진행 시간(분) */
  durationMinutes: number;
  /** 성공 여부 (실패 시 보상 없음, 빨간색으로 표시) */
  success: boolean;
}

/** 업적 정의 (정적 메타데이터) */
export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  /** 달성에 필요한 누적 공부시간(시간 단위). 0이면 "첫 세션 완료"로 판정 */
  thresholdHours: number;
  icon: string;
}

/** 업적 달성 여부 + 달성 시각 저장용 */
export type UnlockedAchievements = Record<string, number>; // id -> unlocked epoch ms

/** 진행 중인 집중 세션 (새로고침 후에도 복원되어야 함) */
export interface ActiveSession {
  startedAt: number; // epoch ms
}

/** 사용자 환경설정 */
export interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
}

/** LocalStorage에 저장되는 전체 앱 상태 */
export interface AppData {
  /** 누적 공부 시간(분) — 실패 세션은 포함되지 않음 */
  totalStudyMinutes: number;
  /** 통장 잔액(원) */
  balance: number;
  /** 전체 거래내역 (최신순으로 unshift) */
  transactions: Transaction[];
  /** 달성한 업적 */
  unlockedAchievements: UnlockedAchievements;
  /** 현재 연속 공부일(Streak) */
  currentStreak: number;
  /** 최고 연속 공부일 */
  bestStreak: number;
  /** 마지막으로 세션을 성공한 날짜(YYYY-MM-DD), 스트릭 계산용 */
  lastStudyDateISO: string | null;
  /** 날짜별 공부 시간(분) 기록 — 주간/월간 그래프 및 오늘 목표 계산용 */
  dailyMinutes: Record<string, number>;
  /** 오늘 목표 공부 시간(시간 단위) */
  dailyGoalHours: number;
  /** 목표 달성 축하 애니메이션을 이미 보여준 날짜 목록(중복 방지) */
  goalCelebratedDates: string[];
  /** 환경설정 */
  settings: Settings;
  /** 진행 중인 세션 (없으면 null) */
  activeSession: ActiveSession | null;
  /** 총 성공 세션 수 */
  totalSessionsCompleted: number;
  /** 총 실패(Emergency Quit) 세션 수 */
  totalSessionsFailed: number;
}

/** 시급 구간(티어) 정보 */
export interface WageTier {
  /** 0부터 시작하는 티어 인덱스 */
  index: number;
  /** 이 티어의 시급(원) */
  wage: number;
  /** 이 티어를 채우는 데 필요한 시간 폭(시간) */
  durationHours: number;
  /** 이 티어가 시작되는 누적 시간(exclusive lower bound) */
  startHour: number;
  /** 이 티어가 끝나는 누적 시간(inclusive upper bound) */
  endHour: number;
}

/** 집중 세션 UI 상태 */
export type SessionPhase = 'idle' | 'focus';
