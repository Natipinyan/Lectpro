import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRouteStudents from "./services/PrivateRouteStudents";
import PrivateRouteInstructor from "./services/PrivateRouteInstructor";
import LoginStudents from "./components/logAndRegStudent/Login";
import RegisterStudent from "./components/logAndRegStudent/Register";
import RegisterInstructor from "./components/logAndRegInstructor/Register";
import HomeStudent from "./components/HomeStudents";
import HomeInstructor from "./components/HomeInstructor";
import PageOne from "./components/PageOne";
import PageTwo from "./components/PageTwo";
import MainLayout from "./layout/MainLayout";
import LoginInstructor from "./components/logAndRegInstructor/Login";

const onLoginSuccess = () => {
    console.log("Login successful!");
};

export default function BaseRouter() {
    const router = createBrowserRouter([
        {
            path: "/students",
            element: <MainLayout />,
            children: [
                { index: true, element: <LoginStudents onLoginSuccess={onLoginSuccess} /> },
                { path: "register", element: <RegisterStudent /> },
                { path: "HomeStudent", element: <PrivateRouteStudents element={HomeStudent} /> },
                { path: "pageOne", element: <PrivateRouteStudents element={PageOne} /> },
                { path: "pageTwo", element: <PrivateRouteStudents element={PageTwo} /> },
            ],
        },
        {
            path: "/instructor",
            element: <MainLayout />,
            children: [
                { index: true, element: <LoginInstructor onLoginSuccess={onLoginSuccess} /> },
                { path: "register", element: <RegisterInstructor /> },
                { path: "HomeInstructor", element: <PrivateRouteInstructor element={HomeInstructor} /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}
//important change coockies