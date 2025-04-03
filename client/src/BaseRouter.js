import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./services/PrivateRoute";
import LoginStudents from "./components/logAndRegStudent/Login";
import RegisterStudent from "./components/logAndRegStudent/Register";
import RegisterInstructor from "./components/logAndRegInstructor/Register";
import HomeStudent from "./components/Home";
import PageOne from "./components/PageOne";
import PageTwo from "./components/PageTwo";
import MainLayout from "./layout/MainLayout";
import LoginInstructor from "./components/logAndRegInstructor/Login";

const onLoginSuccess = () => {
    console.log("Login successful!");
};

export default function BaseRouter() {
    const router = createBrowserRouter([
        // נתיבי סטודנטים
        {
            path: "/",
            element: <MainLayout />,
            children: [
                { index: true, element: <LoginStudents onLoginSuccess={onLoginSuccess} /> },
                { path: "register", element: <RegisterStudent /> },
                { path: "home", element: <PrivateRoute element={HomeStudent} /> },
                { path: "pageOne", element: <PrivateRoute element={PageOne} /> },
                { path: "pageTwo", element: <PrivateRoute element={PageTwo} /> },
            ],
        },
        // נתיבי מרצים
        {
            path: "/instructor",
            element: <MainLayout />,
            children: [
                { index: true, element: <LoginInstructor onLoginSuccess={onLoginSuccess} /> },
                { path: "register", element: <RegisterInstructor /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}
//important change coockies