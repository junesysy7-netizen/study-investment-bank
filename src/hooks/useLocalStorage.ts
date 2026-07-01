import { useEffect, useRef, useState } from 'react';

/**
 * LocalStorage와 동기화되는 state 훅.
 * - 최초 마운트 시 저장된 값을 불러오고, 없으면 initialValue 사용
 * - state가 바뀔 때마다 자동으로 LocalStorage에 저장
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  // 최초 렌더에서는 굳이 다시 쓰지 않아도 되지만, 이후 변경분은 항상 반영
  const isFirstRun = useRef(true);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* 저장 용량 초과 등은 조용히 무시 (앱 동작에는 영향 없음) */
    }
    isFirstRun.current = false;
  }, [key, state]);

  return [state, setState];
}
