import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  CalendarCheck,
  Heart,
  Settings as SettingsIcon,
  CircleCheck,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "../stores/useAppStore.js";
import { getAppointments } from "../services/api.js";

const TABS = [
  { key: "info", label: "Personal info", icon: User },
  { key: "appointments", label: "My appointments", icon: CalendarCheck, linkTo: "/appointments" },
  { key: "favorites", label: "Favorites", icon: Heart, linkTo: "/" },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

export default function ProfilePage() {
  const displayName = useAppStore((state) => state.displayName);
  const setDisplayName = useAppStore((state) => state.setDisplayName);
  const favoriteDoctorIds = useAppStore((state) => state.favoriteDoctorIds);
  const clearFavorites = useAppStore((state) => state.clearFavorites);

  const [activeTab, setActiveTab] = useState("info");
  const [saved, setSaved] = useState(false);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [appointmentsStatus, setAppointmentsStatus] = useState("loading");

  // Uncontrolled inputs (required by spec): read via refs, not state.
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    setAppointmentsStatus("loading");
    getAppointments()
      .then((res) => {
        const appointments = res.data;
        setAppointmentsCount(appointments.length);
        const today = new Date().toISOString().slice(0, 10);
        setCompletedCount(appointments.filter((appt) => appt.date < today).length);
        setAppointmentsStatus("success");
      })
      .catch(() => setAppointmentsStatus("error"));
  }, []);

  const handleSave = () => {
    const name = nameRef.current.value.trim();
    if (name) setDisplayName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleReset = () => {
    setDisplayName("Mariam Mohamed");
    clearFavorites();
    if (nameRef.current) nameRef.current.value = "Mariam Mohamed";
  };

  return (
    <div className="bg-white dark:bg-[#0c1113] rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
      <div className="px-5 h-14 flex items-center border-b border-black/10 dark:border-white/10">
        <span className="font-medium">Profile</span>
      </div>

      <div className="p-5 flex gap-4">
        <div className="w-28 shrink-0 flex flex-col gap-1">
          {TABS.map(({ key, label, icon: Icon, linkTo }) => {
            const isActive = activeTab === key;
            const content = (
              <>
                <Icon size={14} aria-hidden="true" />
                <span className="text-[11px]">{label}</span>
                {key === "favorites" && (
                  <span className="ml-auto text-[10px] bg-coral-100 text-coral-900 px-1.5 rounded-md">
                    {favoriteDoctorIds.length}
                  </span>
                )}
              </>
            );
            const className = `rounded-lg px-2.5 py-2 flex items-center gap-1.5 ${
              isActive
                ? "bg-plum-50 text-plum-900 font-medium dark:bg-plum-900/30 dark:text-plum-100"
                : "text-black/60 dark:text-white/60"
            }`;

            if (linkTo) {
              return (
                <Link key={key} to={linkTo} className={className}>
                  {content}
                </Link>
              );
            }
            return (
              <button key={key} type="button" onClick={() => setActiveTab(key)} className={className}>
                {content}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {activeTab === "settings" ? (
            <div>
              <p className="font-medium text-sm text-teal-900 dark:text-teal-100 mb-1">Settings</p>
              <p className="text-xs text-black/60 dark:text-white/60 mb-4">
                Dark mode lives in the top navigation bar now.
              </p>
              <div className="flex items-center justify-between border border-coral-100 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <RotateCcw size={15} className="text-coral-800" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium">Reset profile</p>
                    <p className="text-[11px] text-black/60 dark:text-white/60">
                      Clears favorites and restores your default name.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs border border-coral-100 text-coral-800 rounded-lg px-3 py-1.5"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-medium text-sm text-teal-900 dark:text-teal-100 mb-1">Personal information</p>
              <p className="text-xs text-black/60 dark:text-white/60 mb-3">Update your contact details.</p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-black/60 dark:text-white/60 uppercase tracking-wide block mb-1">
                    Display name
                  </label>
                  {/* Uncontrolled input: value read on demand via ref, no onChange/state binding */}
                  <input ref={nameRef} defaultValue={displayName} className="w-full" />
                </div>
                <div>
                  <label className="text-[11px] text-black/60 dark:text-white/60 uppercase tracking-wide block mb-1">
                    Email
                  </label>
                  <input ref={emailRef} type="email" defaultValue="mariam.mohamed@email.com" className="w-full" />
                </div>
                <div>
                  <label className="text-[11px] text-black/60 dark:text-white/60 uppercase tracking-wide block mb-1">
                    Phone
                  </label>
                  <input ref={phoneRef} type="tel" defaultValue="+20 100 123 4567" className="w-full" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="bg-teal-900 text-teal-100 rounded-lg px-4 py-2 text-sm mt-3"
              >
                {saved ? "Saved ✓" : "Save changes"}
              </button>
            </div>
          )}

          {appointmentsStatus === "error" && (
            <p className="text-xs text-red-700 dark:text-red-400">Could not load appointment statistics. Make sure the API server is running.</p>
          )}

          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={CalendarCheck} value={appointmentsCount} label="Appointments" color="text-teal-900 dark:text-teal-100" />
            <StatCard icon={Heart} value={favoriteDoctorIds.length} label="Favorites" color="text-coral-600" />
            <StatCard icon={CircleCheck} value={completedCount} label="Completed" color="text-teal-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-center">
      <Icon size={16} className={`mx-auto ${color}`} aria-hidden="true" />
      <p className="font-semibold text-base mt-1">{value}</p>
      <p className="text-[10px] text-black/60 dark:text-white/60">{label}</p>
    </div>
  );
}
