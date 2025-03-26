import { createBrowserRouter,RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../components/Login";
import Register from "../components/Register";
import PrivateRoute from "./PrivateRoute";
import Home from "../components/Home";
import PageOne from "../components/PageOne";
import PageTwo from "../components/PageTwo";
import React from "react";

const onLoginSuccess = () => {
    console.log("Login successful!");
};

export default function Router() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                {
                    element: <Login onLoginSuccess={onLoginSuccess} />,
                    index: true,
                },
                {
                    path: '/register',
                    element: <Register />,
                },
                {
                    path: '/home',
                    element: <PrivateRoute element={Home} />,
                },
                {
                    path: '/PageOne',
                    element: <PrivateRoute element={PageOne} />,
                },

                {
                    path: '/PageTwo',
                    element: <PrivateRoute element={PageTwo} />,
                },


            ],
        },
    ]);

    return (
            <RouterProvider router={router} />
    );
}
