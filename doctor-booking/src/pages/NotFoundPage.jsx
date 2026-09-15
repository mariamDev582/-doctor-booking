import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="bg-white dark:bg-[#0c1113] rounded-2xl border border-black/10 dark:border-white/10 py-11 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-coral-100 flex items-center justify-center mx-auto mb-4 -rotate-6">
        <span className="text-coral-800 font-medium text-lg">404</span>
      </div>
      <p className="text-xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
        We lost this page
      </p>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">
        It may have been moved or never existed.
      </p>
      <Link
        to="/"
        className="inline-block bg-teal-900 text-teal-100 rounded-lg px-5 py-2.5 text-sm"
      >
        Take me to doctors
      </Link>
    </div>
  );
}
