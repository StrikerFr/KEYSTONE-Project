import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";
const STORAGE_KEY = "keystone-theme";

/** Runs before hydration so the first paint already matches the stored theme. */
export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var e=document.documentElement;e.classList.toggle('dark',t!=='light');e.style.colorScheme=t;}catch(_){}})();`;

function current(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(current());
  }, []);

  const apply = useCallback((next: Theme) => {
    const el = document.documentElement;
    el.classList.add("theme-anim");
    el.classList.toggle("dark", next === "dark");
    el.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    setTheme(next);
    window.setTimeout(() => el.classList.remove("theme-anim"), 320);
  }, []);

  const toggle = useCallback(() => apply(current() === "dark" ? "light" : "dark"), [apply]);

  return { theme, setTheme: apply, toggle };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to day theme" : "Switch to night theme"}
      title={dark ? "Day theme" : "Night theme"}
      className={cn(
        "relative inline-grid h-8 w-8 place-items-center rounded-md border border-border/80 bg-surface-1/70 text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-[15px] w-[15px] transition-all duration-300",
          dark ? "scale-50 opacity-0 -rotate-90" : "scale-100 opacity-100 rotate-0",
        )}
      />
      <Moon
        className={cn(
          "absolute h-[15px] w-[15px] transition-all duration-300",
          dark ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 rotate-90",
        )}
      />
    </button>
  );
}
