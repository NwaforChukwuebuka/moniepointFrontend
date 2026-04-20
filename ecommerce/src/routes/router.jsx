import { createBrowserRouter } from "react-router";
import Login from "../auth/login";
import Products from "../components/products/Products";
import Product from "../components/product/product";

const router = createBrowserRouter([
    {

    path: "/",
    element: <Login />  
    },
    {
        path: "/products",
        element: <Products />
    },
    {
        path: "/product/:id",
        element: <Product />
    }

])

export default router;