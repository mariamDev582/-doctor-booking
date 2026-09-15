import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Plus, Clock3 } from "lucide-react";
import { getAppointments, deleteAppointment } from "../services/api.js";
import AppointmentCard from "../components/AppointmentCard.jsx";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [cancelId, setCancelId] = useState(null);
  const [toast, setToast] = useState("");

  const loadAppointments = () => {
    setStatus("loading");
    getAppointments()
      .then((res) => { setAppointments(res.data); setStatus("success"); })
      .catch(() => setStatus("error"));
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleEdit = (appointment) => navigate(`/book?editId=${appointment.id}`);

  const confirmCancel = async () => {
    try {
      await deleteAppointment(cancelId);
      setAppointments((prev) => prev.filter((appt) => appt.id !== cancelId));
      setToast("Appointment cancelled successfully");
      setTimeout(() => setToast(""), 2000);
    } finally { setCancelId(null); }
  };

  return (
    <div className="appointments-page">
      <div className="appointments-hero">
        <div>
          <p className="text-teal-100 text-xs mb-1">Stay organized</p>
          <h1 className="text-white text-2xl font-semibold">Appointments</h1>
          <p className="text-teal-100/80 text-sm mt-1">Manage your upcoming doctor visits in one place.</p>
        </div>
        <button type="button" onClick={() => navigate("/")} className="appointment-new-button">
          <Plus size={16} /> Book new
        </button>
      </div>

      <div className="appointments-content">
        {toast && <div className="success-toast">{toast}</div>}

        {status === "loading" && <p className="empty-message">Loading appointments…</p>}
        {status === "error" && (
          <div className="empty-state">
            <CalendarCheck size={30} />
            <p className="font-medium mt-2">Couldn't load your appointments</p>
            <p className="text-sm mt-1">Make sure the API server is running.</p>
          </div>
        )}
        {status === "success" && appointments.length === 0 && (
          <div className="empty-state">
            <CalendarCheck size={32} />
            <p className="font-medium mt-2">No appointments yet</p>
            <p className="text-sm mt-1">Choose a doctor and book your first appointment.</p>
            <button type="button" onClick={() => navigate("/")} className="empty-action">Find a doctor</button>
          </div>
        )}
        {status === "success" && appointments.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Your visits</p>
                <p className="text-xs text-black/50 dark:text-white/50 flex items-center gap-1 mt-0.5"><Clock3 size={12} /> {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="appointment-grid">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} onEdit={handleEdit} onCancel={setCancelId} />
              ))}
            </div>
          </>
        )}
      </div>

      {cancelId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50">
          <div className="bg-white dark:bg-[#0c1113] rounded-2xl p-5 max-w-xs w-full shadow-xl">
            <p className="font-medium mb-1">Cancel this appointment?</p>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">This action can't be undone.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCancelId(null)} className="flex-1 border border-black/10 dark:border-white/20 rounded-lg h-9 text-sm">Keep it</button>
              <button type="button" onClick={confirmCancel} className="flex-1 bg-red-700 text-white rounded-lg h-9 text-sm">Cancel it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
