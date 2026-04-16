import { createBrowserRouter } from "react-router";
import Login from "../auth/login";

const router = createBrowserRouter([
    {

    path: "/",
    element: <Login />  
    }

])

export default router;