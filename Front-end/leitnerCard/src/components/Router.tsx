import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./Registration/registrationpage";
import Profile from "./Profile/profilepage";
import Edit from "./revision/edit";
import Review from "./revision/review";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cards/edit/:id",
        element: <Edit />,
      },
      {
        path: "/review/:id",
        element: <Review />,
      },
    ],
  },
]);

export default router;
