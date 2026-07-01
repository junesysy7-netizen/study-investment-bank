import { motion } from 'framer-motion';

interface HeaderProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onToggleDarkMode: () => void;
  onToggleSound: () => void;
}

export default function Header({ darkMode, soundEnabled, onToggleDarkMode, onToggleSound }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bank-green text-white font-display text-lg font-semibold shadow-sm">
          S
        </div>
        <div>
          <p className="font-display text-[15px] font-semibold leading-tight text-ink dark:text-vault-ink">
            Study Investment Bank
          </p>
          <p className="text-[11px] leading-tight text-muted dark:text-vault-muted">공부 투자 통장</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <IconToggleButton
          label={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          active={soundEnabled}
          onClick={onToggleSound}
        >
          {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </IconToggleButton>
        <IconToggleButton
          label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          active={darkMode}
          onClick={onToggleDarkMode}
        >
          {darkMode ? <MoonIcon /> : <SunIcon />}
        </IconToggleButton>
      </div>
    </header>
  );
}

function IconToggleButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
        active
          ? 'border-line bg-surface text-ink dark:border-vault-line dark:bg-vault-elevated dark:text-vault-ink'
          : 'border-line bg-surface text-muted dark:border-vault-line dark:bg-vault-elevated dark:text-vault-muted'
      }`}
    >
      {children}
    </motion.button>
  );
}

function SoundOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
function SoundOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
