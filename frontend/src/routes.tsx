import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Activity from "./pages/activity/Activity";
import Room from "./pages/room/Room";
import Profile from "./pages/profile/Profile";
import Welcome from "./pages/welcome/Welcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/activity",
    element: <Activity />,
  },
  {
    path: "/room",
    element: <Room />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  { path: "*", element: <div>Not Found</div> },
]);

export default router;
