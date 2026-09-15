import { NavLink } from "react-router-dom";
import { Stethoscope, CalendarCheck, Moon, Sun, UserRound } from "lucide-react";
import { useAppStore } from "../stores/useAppStore.js";

const links = [
  { to: "/", label: "Doctors", icon: Stethoscope, end: true },
  { to: "/appointments", label: "Appointments", icon: CalendarCheck, end: false },
];

function initials(name) {
  return name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const displayName = useAppStore((state) => state.displayName);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0c1113]/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-[15px] text-teal-900 dark:text-teal-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-900 flex items-center justify-center shadow-sm">
            <Stethoscope size={17} className="text-teal-100" aria-hidden="true" />
          </div>
          <span className="hidden sm:inline">MediBook</span>
        </NavLink>

        <nav className="flex items-center gap-2 sm:gap-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-100 font-medium"
                    : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}

          <div className="w-px h-7 bg-black/10 dark:bg-white/15 mx-0.5" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            className="theme-toggle"
          >
            <Sun size={13} className={theme === "light" ? "theme-icon-active" : "theme-icon-muted"} aria-hidden="true" />
            <span className="theme-thumb" />
            <Moon size={13} className={theme === "dark" ? "theme-icon-active" : "theme-icon-muted"} aria-hidden="true" />
          </button>

          <NavLink
            to="/profile"
            aria-label="Open profile"
            className={({ isActive }) =>
              `profile-nav ${isActive ? "profile-nav-active" : ""}`
            }
          >
            <div className="profile-avatar">{initials(displayName)}</div>
            <div className="hidden lg:block min-w-0">
              <p className="text-[11px] text-black/45 dark:text-white/45 leading-none">Profile</p>
              <p className="text-xs font-medium truncate max-w-[90px]">{displayName}</p>
            </div>
            <UserRound size={14} className="hidden md:block text-black/35 dark:text-white/35" aria-hidden="true" />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
