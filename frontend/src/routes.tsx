import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "./common/components/Spinner/Spinner";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Activity = lazy(() => import("./pages/activity/Activity"));
const Room = lazy(() => import("./pages/room/Room"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Welcome = lazy(() => import("./pages/welcome/Welcome"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Spinner />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<Spinner />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/activity",
    element: (
      <Suspense fallback={<Spinner />}>
        <Activity />
      </Suspense>
    ),
  },
  {
    path: "/room",
    element: (
      <Suspense fallback={<Spinner />}>
        <Room />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<Spinner />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/welcome",
    element: (
      <Suspense fallback={<Spinner />}>
        <Welcome />
      </Suspense>
    ),
  },
  { path: "*", element: <div>Not Found</div> },
]);

const AppRoutes = () => {
  return (
    <div className="bg-base h-screen">
      <RouterProvider router={router} />
    </div>
  );
};

export default AppRoutes;
