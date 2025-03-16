import React, { useEffect } from "react";
import LandingPage from "./Landing/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Dashboard/Dashbaord";
import TextNotesPage from "./pages/TextNotesPage";
import DrawingNotesPage from "./pages/DrawingNotesPage";
import ReminderNotesPage from "./pages/ReminderNotesPage";
import NotificationTest from "./components/NotificationTest";
import StatusTestPage from "./Dashboard/pages/StatusTestPage";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/text-notes",
    element: <TextNotesPage />,
  },
  {
    path: "/drawing-notes",
    element: <DrawingNotesPage />,
  },
  {
    path: "/reminder-notes",
    element: <ReminderNotesPage />,
  },
  {
    path: "/notification-test",
    element: <NotificationTest />,
  },
  {
    path: "/status-test",
    element: <StatusTestPage />,
  },
]);

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
