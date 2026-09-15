import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

// Bonus: route lazy loading — each page is code-split and only
// downloaded when the user actually navigates to it.
const DoctorsPage = lazy(() => import("../pages/DoctorsPage.jsx"));
const DoctorDetailsPage = lazy(() => import("../pages/DoctorDetailsPage.jsx"));
const BookAppointmentPage = lazy(() => import("../pages/BookAppointmentPage.jsx"));
const AppointmentsPage = lazy(() => import("../pages/AppointmentsPage.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.jsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.jsx"));

function withSuspense(Element) {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-black/50 dark:text-white/50 py-10 text-center">Loading…</p>
      }
    >
      {Element}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: withSuspense(<DoctorsPage />) },
      { path: "doctors/:id", element: withSuspense(<DoctorDetailsPage />) },
      { path: "book", element: withSuspense(<BookAppointmentPage />) },
      { path: "appointments", element: withSuspense(<AppointmentsPage />) },
      { path: "profile", element: withSuspense(<ProfilePage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);

export default router;
