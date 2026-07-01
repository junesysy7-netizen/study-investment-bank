import { WageTier } from '../types';

/**
 * 누적 공부 시간(시간 단위)을 받아 현재 속한 시급 티어를 계산한다.
 *
 * 규칙:
 *  1~5h   → 20,000원 (구간폭 5h)
 *  6~15h  → 30,000원 (구간폭 10h)
 *  16~30h → 40,000원 (구간폭 15h)
 *  31~50h → 50,000원 (구간폭 20h)
 *  51~75h → 60,000원 (구간폭 25h)
 *  76~105h→ 70,000원 (구간폭 30h)
 *  이후 매 구간마다 구간폭 +5h, 시급 +10,000원씩 반복 증가.
 */
export function getWageTier(totalHours: number): WageTier {
  const hours = Math.max(0, totalHours);

  let start = 0;
  let duration = 5;
  let wage = 20000;
  let index = 0;

  // 안전장치: 무한루프 방지 (최대 100만 시간까지 계산하면 충분)
  while (index < 1_000_000) {
    const end = start + duration;
    if (hours <= end) {
      return { index, wage, durationHours: duration, startHour: start, endHour: end };
    }
    start = end;
    duration += 5;
    wage += 10000;
    index += 1;
  }

  // 도달할 수 없는 fallback
  return { index, wage, durationHours: duration, startHour: start, endHour: start + duration };
}

/** 다음 티어의 시급을 반환 */
export function getNextWage(tier: WageTier): number {
  return tier.wage + 10000;
}

/** 다음 레벨(시급 인상)까지 남은 시간(시간 단위) */
export function getHoursToNextLevel(totalHours: number): number {
  const tier = getWageTier(totalHours);
  return Math.max(0, tier.endHour - totalHours);
}

/** 현재 티어 내 진행률(0~1) — 프로그레스 바 표시용 */
export function getTierProgress(totalHours: number): number {
  const tier = getWageTier(totalHours);
  const into = totalHours - tier.startHour;
  return Math.min(1, Math.max(0, into / tier.durationHours));
}

/** 통화 포맷 (₩1,234,567) */
export function formatCurrency(amount: number): string {
  return '₩' + Math.round(amount).toLocaleString('ko-KR');
}

/** 시간(분)을 "12시간 30분" 형태로 포맷 */
export function formatHoursMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}
