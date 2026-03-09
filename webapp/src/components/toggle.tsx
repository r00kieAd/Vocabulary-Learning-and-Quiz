import { useEffect, useMemo, useState } from 'react';
import '../styles/toggle.css';

type Theme = 'dark' | 'ocean' | 'light' | 'earth';

const LOCAL_STORAGE_KEY = 'appTheme';

const themeOptions: Array<{ value: Theme; label: string }> = [
  { value: 'dark', label: 'Dark' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'light', label: 'Light' },
  { value: 'earth', label: 'Earth' },
];

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored && themeOptions.some((option) => option.value === stored)) {
    return stored as Theme;
  }

  return 'dark';
};

const Toggle = () => {
  const [activeTheme, setActiveTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, activeTheme);
    }
  }, [activeTheme]);

  const changeTheme = (value: Theme) => {
    setActiveTheme(value);
  };

  const themeLabel = useMemo(
    () =>
      themeOptions.find((option) => option.value === activeTheme)?.label ??
      activeTheme,
    [activeTheme]
  );

  return (
    <div className="theme-toggle">
      <span className="theme-toggle-label">
        Theme:&nbsp;<strong>{themeLabel}</strong>
      </span>
      <div
        className="theme-toggle-menu"
        role="radiogroup"
        aria-label="Select theme"
      >
        {themeOptions.map((option) => (
          <label
            key={option.value}
            className={`theme-option ${
              activeTheme === option.value ? 'active' : ''
            }`}
            data-theme-value={option.value}
          >
            <input
              type="radio"
              name="app-theme"
              value={option.value}
              checked={activeTheme === option.value}
              onChange={() => changeTheme(option.value)}
              aria-checked={activeTheme === option.value}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Toggle;
