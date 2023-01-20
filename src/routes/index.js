import Login from "../pages/auth/login";
import Home from "../pages/userside/home";
import ViewRequests from "../pages/userside/viewRequests";

const mainRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/view-requests",
    element: <ViewRequests />,
  }
];

export default mainRoutes;