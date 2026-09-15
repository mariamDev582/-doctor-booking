import { Link } from "react-router-dom";
import { Heart, ArrowUpRight, CalendarDays } from "lucide-react";
import { useAppStore } from "../stores/useAppStore.js";

const AVATAR_COLORS = [
  { bg: "bg-coral-100", text: "text-coral-900" },
  { bg: "bg-plum-100", text: "text-plum-900" },
  { bg: "bg-teal-100", text: "text-teal-900" },
];

function initials(name) {
  return name.replace("Dr.", "").trim().split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function DoctorCard({ doctor }) {
  const isFavorite = useAppStore((state) => state.isFavoriteDoctor(doctor.id));
  const toggleFavoriteDoctor = useAppStore((state) => state.toggleFavoriteDoctor);
  const colors = AVATAR_COLORS[doctor.id % AVATAR_COLORS.length];

  return (
    <article className="doctor-card group">
      <Link to={`/doctors/${doctor.id}`} className="flex items-start gap-3 min-w-0 flex-1">
        <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center font-semibold text-sm shrink-0`}>
          {initials(doctor.name)}
        </div>
        <div className="min-w-0 pt-0.5">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{doctor.name}</p>
            <span className="doctor-online">Available</span>
          </div>
          <p className="text-xs text-teal-800 dark:text-teal-100 mt-1">{doctor.specialty}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-black/50 dark:text-white/50">
            <CalendarDays size={13} aria-hidden="true" />
            <span>Book an appointment</span>
          </div>
        </div>
      </Link>
      <div className="flex flex-col items-end justify-between gap-5 shrink-0">
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavoriteDoctor(doctor.id)}
          className="favorite-button"
        >
          <Heart size={17} className={isFavorite ? "fill-coral-600 text-coral-600" : "text-black/35 dark:text-white/35"} aria-hidden="true" />
        </button>
        <ArrowUpRight size={16} className="text-black/25 dark:text-white/25 group-hover:text-teal-700 dark:group-hover:text-teal-200 transition-colors" aria-hidden="true" />
      </div>
    </article>
  );
}
