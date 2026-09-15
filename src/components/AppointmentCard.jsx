import { Pencil, X } from "lucide-react";

const STATUS_STYLES = {
  confirmed: "bg-teal-100 text-teal-900",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-black/10 text-black/60",
};

const STATUS_BAR = {
  confirmed: "bg-teal-400",
  pending: "bg-amber-100",
  cancelled: "bg-black/20",
};

export default function AppointmentCard({ appointment, onEdit, onCancel }) {
  const status = appointment.status || "pending";

  return (
    <div className="flex rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
      <div className={`w-1.5 ${STATUS_BAR[status]}`} aria-hidden="true" />
      <div className="flex-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm">{appointment.doctorName}</p>
          <span className={`text-[11px] px-2 py-0.5 rounded-md shrink-0 ${STATUS_STYLES[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="text-xs text-black/60 dark:text-white/60 mt-1 mb-2">
          {appointment.date} · {appointment.time}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onEdit(appointment)}
            className="flex items-center gap-1 text-xs text-teal-800 dark:text-teal-100"
          >
            <Pencil size={13} aria-hidden="true" />
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => onCancel(appointment.id)}
            className="flex items-center gap-1 text-xs text-red-700 dark:text-red-400"
          >
            <X size={13} aria-hidden="true" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
