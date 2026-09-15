import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { getDoctor } from "../services/api.js";
import { useAppStore } from "../stores/useAppStore.js";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState("loading");

  const isFavorite = useAppStore((state) => (doctor ? state.isFavoriteDoctor(doctor.id) : false));
  const toggleFavoriteDoctor = useAppStore((state) => state.toggleFavoriteDoctor);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    getDoctor(id)
      .then((res) => {
        if (!ignore) {
          setDoctor(res.data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (status === "loading") {
    return <p className="text-sm text-black/60 dark:text-white/60 py-8 text-center">Loading doctor…</p>;
  }

  if (status === "error" || !doctor) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-700 dark:text-red-400 mb-3">Doctor not found.</p>
        <Link to="/" className="text-sm text-teal-800 dark:text-teal-100 underline">
          Back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0c1113] rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
      <div className="bg-coral-100 px-5 pt-5 pb-9">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} className="text-coral-900" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavoriteDoctor(doctor.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-coral-600 text-coral-600" : "text-coral-900"}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-coral-600 font-medium">
            {doctor.name
              .replace("Dr.", "")
              .trim()
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div>
            <p className="font-medium text-[17px] text-coral-900">{doctor.name}</p>
            <p className="text-xs text-coral-800">
              {doctor.specialty} · {doctor.experienceYears} yrs experience
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 -mt-5">
        <div className="bg-white dark:bg-[#0c1113] rounded-2xl border border-black/10 dark:border-white/10 p-4 mb-4">
          <p className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">Available days</p>
          <div className="flex gap-2 flex-wrap">
            {doctor.availableDays.map((day) => (
              <span key={day} className="bg-teal-100 text-teal-900 text-xs px-2.5 py-1 rounded-lg">
                {day}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed mb-5">
          {doctor.description}
        </p>

        <Link
          to={`/book?doctorId=${doctor.id}`}
          className="block text-center w-full bg-teal-900 text-teal-100 rounded-lg h-11 leading-[44px]"
        >
          Book with {doctor.name}
        </Link>
      </div>
    </div>
  );
}
