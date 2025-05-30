import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRouteStudents from "./services/PrivateRouteStudents";
import PrivateRouteInstructor from "./services/PrivateRouteInstructor";
import LoginStudents from "./components/logAndRegStudent/Login";
import RegisterStudent from "./components/logAndRegStudent/Register";
import RegisterInstructor from "./components/logAndRegInstructor/Register";
import HomeStudent from "./components/base/HomeStudents";
import OpenPro from "./components/projects/OpenPro";
import HomeInstructor from "./components/base/HomeInstructor";
import PageOne from "./components/base/PageOne";
import PageTwo from "./components/base/PageTwo";
import MainLayout from "./layout/MainLayout";
import LoginInstructor from "./components/logAndRegInstructor/Login";
import UpFile from "./components/projects/Upload";
import Profile from "./components/logAndRegStudent/Profile"
import ForgotPassword from "./components/logAndRegStudent/ForgotPassword";

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
                { path: "forgot-password", element:<ForgotPassword />},
                { path: "HomeStudent", element: <PrivateRouteStudents element={HomeStudent} /> },
                { path: "pageOne", element: <PrivateRouteStudents element={PageOne} /> },
                { path: "pageTwo", element: <PrivateRouteStudents element={PageTwo} /> },
                { path: "upload", element: <PrivateRouteStudents element={OpenPro} /> },
                { path: "UpFile", element: <PrivateRouteStudents element={UpFile} /> },
                { path: "Profile", element: <PrivateRouteStudents element={Profile} /> },
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