# MediBook — Doctor Appointment Booking

A React single-page app where a patient can browse doctors, view details, and book, reschedule, or cancel appointments.

## Features
- Doctors list with controlled search and specialty filtering
- Doctor details page via a dynamic route (`/doctors/:id`)
- Book appointment form (React Hook Form + validation)
- My appointments: reschedule (update) and cancel (delete, with confirmation)
- Profile page: theme toggle and display name (uncontrolled input via `useRef`) using a shared Zustand store
- 404 page for unknown routes
- Loading, error, and empty states on every data-driven page

## Tech stack
React 18 · React Router 6 · Axios · React Hook Form · Zustand · Tailwind CSS · Vite · json-server

## Setup
```bash
npm install
```

## Run the API (fake REST backend)
```bash
npm run api
```
This starts json-server on `http://localhost:3001` using `db.json`, exposing `/doctors` and `/appointments`.

## Run the app
In a second terminal:
```bash
npm run dev
```
Open the printed local URL (typically `http://localhost:5173`).

## Build
```bash
npm run build
```

## Notes
- All Axios configuration lives in `src/services/api.js`.
- The single Zustand store (`src/stores/useAppStore.js`) holds theme, favorite doctors, and the shared specialty filter — everything else stays local component state.


## Submission checklist
- Do not include `node_modules` in the ZIP.
- Run `npm install` after extracting the project.
- Run `npm run api` in one terminal and `npm run dev` in another.
- Do not include `.env` or API keys; use `.env.example` if environment variables are added.
- Record a short demo covering navigation, doctors, search/filtering, details, booking, appointments, reschedule, cancel, validation, and bonus features.
- Push the project to GitHub with multiple meaningful commits during development.
