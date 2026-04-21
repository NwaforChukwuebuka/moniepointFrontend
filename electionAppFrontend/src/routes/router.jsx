import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import Elections from "../pages/Elections";
import Candidates from "../pages/Candidates";
import Results from "../pages/Results";
import Register from "../auth/Register";
import Login from "../auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Elections />,
      },
      {
        path: "elections/:electionId/candidates",
        element: <Candidates />,
      },
      {
        path: "elections/:electionId/results",
        element: <Results />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
