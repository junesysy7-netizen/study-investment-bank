# Study Investment Bank (공부 투자 통장)

공부한 시간이 복리처럼 쌓이는 가상 투자 통장. 진정한 재테크는 나에게 투자하는 시간입니다.
"이 시간을 통해 나는 미래의 시급을 올리고 있다"는 철학을 게임처럼 시각화한 개인용 웹앱입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

배포용 빌드:

```bash
npm run build
npm run preview
```

## 핵심 기능

- **30분 집중 세션 타이머**: START 버튼만 표시되며, 시작 후에는 Emergency Quit(확인창 포함)만 가능합니다. 성공 시 현재 시급의 절반이 입금되고, 실패(중단) 시 보상 없이 Streak가 초기화됩니다.
- **가상 통장**: 잔액, 총 공부시간, 총 획득금액, 현재 시급, 다음 레벨까지 남은 시간을 표시합니다.
- **시급 성장(복리) 시스템**: 1~5h→2만 / 6~15h→3만 / 16~30h→4만 / 31~50h→5만 / 51~75h→6만 / 76~105h→7만원, 이후 구간폭 +5h·시급 +1만원씩 자동 반복 (`src/utils/wageCalculator.ts`).
- **거래내역**: 성공/실패 세션 모두 시각적으로 구분해 기록합니다.
- **업적 시스템**: 첫 세션, 10/50/100/500/1000시간 달성 배지.
- **주간/월간 그래프**: 최근 7일 및 최근 6개월 공부시간 막대그래프.
- **연속 기록(Streak) & 오늘 목표**: 목표 시간 설정 및 달성 시 축하 애니메이션.
- **다크모드 / 효과음 ON-OFF**: Web Audio API로 외부 파일 없이 효과음 생성.
- **새로고침 내구성**: 진행 중인 세션도 타임스탬프 기반으로 복원되며, 30분이 이미 지났다면 자동으로 성공 처리됩니다.
- 모든 데이터는 **LocalStorage**에 저장되어 새로고침해도 유지됩니다 (서버 없음, 이 브라우저에만 저장).

## 프로젝트 구조

```
src/
 ├─ types/index.ts          # 전역 타입 정의
 ├─ utils/
 │   ├─ wageCalculator.ts   # 시급 티어 계산 (핵심 로직)
 │   ├─ dateHelpers.ts      # 날짜/스트릭/그래프용 유틸
 │   ├─ sound.ts            # Web Audio 효과음
 │   └─ achievements.ts     # 업적 정의
 ├─ hooks/
 │   ├─ useLocalStorage.ts  # LocalStorage 동기화 훅
 │   └─ useAppState.ts      # 중앙 상태관리 (세션/보상/스트릭/업적)
 ├─ components/             # UI 컴포넌트 (기능별로 분리)
 └─ App.tsx                 # 전체 조립
```

## 기술 스택

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion
