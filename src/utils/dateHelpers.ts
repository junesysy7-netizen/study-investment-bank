/** Date 객체를 로컬 기준 YYYY-MM-DD 문자열로 변환 (타임존 이슈 방지) */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** 어제 날짜(YYYY-MM-DD) 반환 */
export function yesterdayISO(fromISO?: string): string {
  const base = fromISO ? new Date(fromISO + 'T00:00:00') : new Date();
  base.setDate(base.getDate() - 1);
  return toISODate(base);
}

/** 오늘 기준 최근 n일의 날짜 배열 (과거→오늘 순) */
export function getLastNDates(n: number): string[] {
  const result: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push(toISODate(d));
  }
  return result;
}

/** 요일 짧은 이름 (일,월,화...) */
export function getWeekdayLabel(iso: string): string {
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  const d = new Date(iso + 'T00:00:00');
  return labels[d.getDay()];
}

/** 오늘 기준 최근 n개월의 {year, month, label, key} 배열 (과거→현재 순) */
export function getLastNMonths(n: number): { year: number; month: number; label: string; key: string }[] {
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    result.push({
      year,
      month,
      label: `${month + 1}월`,
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
    });
  }
  return result;
}

/** dailyMinutes 레코드에서 특정 월(key: YYYY-MM)의 총합(분)을 구한다 */
export function sumMinutesForMonth(dailyMinutes: Record<string, number>, monthKey: string): number {
  let sum = 0;
  for (const [date, minutes] of Object.entries(dailyMinutes)) {
    if (date.startsWith(monthKey)) sum += minutes;
  }
  return sum;
}

/** 두 날짜 문자열이 연속된 날인지(a의 다음날이 b) 확인 */
export function isConsecutiveDay(a: string, b: string): boolean {
  return yesterdayISO(b) === a;
}

/** 시:분:초 카운트다운 포맷 (mm:ss) */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 거래내역 타임스탬프를 "오늘 14:32" / "07/03 09:10" 형태로 포맷 */
export function formatTransactionTime(timestamp: number): { dayLabel: string; timeLabel: string } {
  const date = new Date(timestamp);
  const iso = toISODate(date);
  const today = todayISO();
  const yesterday = yesterdayISO();

  let dayLabel: string;
  if (iso === today) dayLabel = '오늘';
  else if (iso === yesterday) dayLabel = '어제';
  else dayLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return { dayLabel, timeLabel: `${hh}:${mm}` };
}
