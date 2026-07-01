// Web Audio API를 이용해 외부 오디오 파일 없이 가벼운 효과음을 생성한다.
// (네트워크 요청 없이 동작하므로 오프라인에서도 안전하게 재생 가능)

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      sharedCtx = new Ctor();
    }
    // 브라우저 자동재생 정책으로 suspended 상태일 수 있어 재개 시도
    if (sharedCtx.state === 'suspended') {
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

function playTone(
  freq: number,
  duration = 0.15,
  type: OscillatorType = 'sine',
  volume = 0.12,
  delay = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const startTime = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  } catch {
    /* 오디오 재생 실패는 조용히 무시 (핵심 기능에 영향 없음) */
  }
}

/** 세션 시작음 — 상승하는 2음 */
export function playStartSound(): void {
  playTone(440, 0.12, 'sine', 0.1, 0);
  playTone(660, 0.16, 'sine', 0.1, 0.1);
}

/** 세션 성공음 — 상승하는 3화음 (밝은 완료 느낌) */
export function playSuccessSound(): void {
  playTone(523.25, 0.15, 'sine', 0.12, 0);
  playTone(659.25, 0.15, 'sine', 0.12, 0.13);
  playTone(783.99, 0.3, 'sine', 0.12, 0.26);
}

/** 세션 실패(Emergency Quit)음 — 낮고 짧은 경고음 */
export function playFailSound(): void {
  playTone(220, 0.25, 'sawtooth', 0.08, 0);
  playTone(164.81, 0.35, 'sawtooth', 0.07, 0.15);
}

/** 동전 입금 효과음 */
export function playCoinSound(): void {
  playTone(880, 0.08, 'square', 0.07, 0);
  playTone(1318.5, 0.1, 'square', 0.05, 0.06);
}

/** 업적/레벨업 팡파레 */
export function playFanfareSound(): void {
  playTone(523.25, 0.12, 'triangle', 0.1, 0);
  playTone(659.25, 0.12, 'triangle', 0.1, 0.12);
  playTone(783.99, 0.12, 'triangle', 0.1, 0.24);
  playTone(1046.5, 0.35, 'triangle', 0.12, 0.36);
}
