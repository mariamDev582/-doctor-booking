import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getDoctors,
  getAppointments,
  createAppointment,
  updateAppointment,
} from "../services/api.js";

export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("editId");
  const doctorIdParam = searchParams.get("doctorId");

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorLoadError, setDoctorLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [toast, setToast] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patientName: "",
      contact: "",
      date: "",
      time: "",
      doctorId: doctorIdParam || "",
      note: "",
    },
  });

  useEffect(() => {
    setDoctorLoadError("");
    getDoctors()
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctorLoadError("Could not load doctors. Please make sure the API server is running."))
      .finally(() => setLoadingDoctors(false));
  }, []);

  useEffect(() => {
    if (!editId) return;
    getAppointments().then((res) => {
      const existing = res.data.find((appt) => String(appt.id) === String(editId));
      if (existing) {
        reset({
          patientName: existing.patientName,
          contact: existing.contact,
          date: existing.date,
          time: existing.time,
          doctorId: String(existing.doctorId),
          note: existing.note || "",
        });
      }
    });
  }, [editId, reset]);

  const onSubmit = async (values) => {
    setSubmitError("");
    const doctor = doctors.find((doc) => String(doc.id) === String(values.doctorId));

    const payload = {
      patientName: values.patientName,
      contact: values.contact,
      date: values.date,
      time: values.time,
      doctorId: Number(values.doctorId),
      doctorName: doctor ? doctor.name : "",
      note: values.note,
      status: "pending",
    };

    try {
      if (editId) {
        await updateAppointment(editId, payload);
        setToast("Appointment updated");
      } else {
        await createAppointment(payload);
        setToast("Appointment booked");
      }
      setTimeout(() => navigate("/appointments"), 600);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c1113] rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
      <div className="px-5 h-14 flex items-center gap-3 border-b border-black/10 dark:border-white/10">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <span className="font-medium">{editId ? "Reschedule appointment" : "New booking"}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4">
        <Field label="Patient name" error={errors.patientName}>
          <input
            {...register("patientName", {
              required: "Patient name is required",
              minLength: { value: 3, message: "Enter at least 3 characters" },
            })}
            placeholder="Your full name"
            className="w-full"
          />
        </Field>

        <Field label="Email or phone" error={errors.contact}>
          <input
            {...register("contact", {
              required: "Contact info is required",
              validate: (value) => {
                const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
                const phone = /^(?:\+?20|0)?1[0125]\d{8}$/.test(value.replace(/[\s-]/g, ""));
                return email || phone || "Enter a valid email or Egyptian phone number";
              },
            })}
            placeholder="name@email.com"
            className="w-full"
          />
        </Field>

        <div className="flex gap-3">
          <Field label="Date" error={errors.date} className="flex-1">
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              {...register("date", {
                required: "Date is required",
                validate: (value) => value >= new Date().toISOString().slice(0, 10) || "Choose today or a future date",
              })}
              className="w-full"
            />
          </Field>
          <Field label="Time" error={errors.time} className="flex-1">
            <input
              type="time"
              {...register("time", { required: "Time is required" })}
              className="w-full"
            />
          </Field>
        </div>

        {doctorLoadError && <p className="text-xs text-red-700 dark:text-red-400">{doctorLoadError}</p>}

        <Field label="Doctor" error={errors.doctorId}>
          <select
            {...register("doctorId", { required: "Please choose a doctor" })}
            className="w-full"
            disabled={loadingDoctors}
          >
            <option value="">{loadingDoctors ? "Loading…" : "Select a doctor"}</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} · {doc.specialty}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Note (optional)">
          <textarea
            {...register("note")}
            placeholder="Reason for visit"
            className="w-full min-h-[70px]"
          />
        </Field>

        {submitError && <p className="text-xs text-red-700 dark:text-red-400">{submitError}</p>}
        {toast && <p className="text-xs text-teal-800 dark:text-teal-100">{toast}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-900 text-teal-100 rounded-lg h-11 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : editId ? "Save changes" : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`border-l-2 border-teal-100 pl-3 ${className}`}>
      <label className="text-[11px] text-black/60 dark:text-white/60 uppercase tracking-wide block mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-700 dark:text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}
