import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getDoctors } from "../services/api.js";
import { useAppStore } from "../stores/useAppStore.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import DoctorCard from "../components/DoctorCard.jsx";
import DoctorCardSkeleton from "../components/DoctorCardSkeleton.jsx";

const PAGE_SIZE = 4;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [search, setSearch] = useState(""); // controlled input
  const [page, setPage] = useState(1);

  // Bonus: debounced search — filtering waits until typing pauses.
  const debouncedSearch = useDebouncedValue(search, 350);

  const specialtyFilter = useAppStore((state) => state.specialtyFilter);
  const setSpecialtyFilter = useAppStore((state) => state.setSpecialtyFilter);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    getDoctors()
      .then((res) => {
        if (!ignore) {
          setDoctors(res.data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, []);

  const specialties = useMemo(
    () => ["All", ...new Set(doctors.map((doc) => doc.specialty))],
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSpecialty = specialtyFilter === "All" || doc.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, debouncedSearch, specialtyFilter]);

  // Bonus: pagination — reset to page 1 whenever the visible list changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, specialtyFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));
  const pagedDoctors = filteredDoctors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="bg-teal-900 rounded-2xl px-5 pt-5 pb-6 mb-4">
        <p className="text-teal-100 text-xs">Good morning</p>
        <p className="text-white font-medium text-lg mb-3">Find your doctor</p>
        <div className="bg-white dark:bg-[#0c1113] rounded-lg flex items-center px-3 h-9">
          <Search size={16} className="text-black/40 dark:text-white/40" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="border-0 bg-transparent focus:outline-none focus:ring-0 shadow-none ml-2 text-sm flex-1"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            type="button"
            onClick={() => setSpecialtyFilter(specialty)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap border ${
              specialtyFilter === specialty
                ? "bg-teal-900 text-teal-100 border-teal-900"
                : "border-black/10 dark:border-white/20 text-black/60 dark:text-white/60"
            }`}
          >
            {specialty}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="bg-white dark:bg-[#0c1113] rounded-2xl px-4 border border-black/10 dark:border-white/10">
          {Array.from({ length: 4 }).map((_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-red-700 dark:text-red-400 py-8 text-center">
          Couldn't load doctors. Make sure the API server is running.
        </p>
      )}

      {status === "success" && filteredDoctors.length === 0 && (
        <p className="text-sm text-black/60 dark:text-white/60 py-8 text-center">
          No doctors match your search.
        </p>
      )}

      {status === "success" && filteredDoctors.length > 0 && (
        <>
          <div className="doctor-grid">
            {pagedDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-40"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <span className="text-xs text-black/60 dark:text-white/60">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/15 disabled:opacity-40"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
