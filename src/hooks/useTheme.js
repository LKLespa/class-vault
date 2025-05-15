import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "app-theme-settings";

function getInitialSettings() {
  if (typeof window === "undefined") return { color: "cyan", appearance: "light" };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore JSON parse errors
  }
  return { color: "cyan", appearance: "light" }; // defaults
}

export function useTheme() {
  const [settings, setSettings] = useState(getInitialSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore localStorage errors
    }
  }, [settings]);

  const setColor = useCallback(
    (color) => setSettings((prev) => ({ ...prev, color })),
    []
  );

  const toggleAppearance = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      appearance: prev.appearance === "light" ? "dark" : "light",
    }));
  }, []);

  return {
    color: settings.color,
    appearance: settings.appearance,
    setColor,
    toggleAppearance,
  };
}
