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
import UpFile from "./components/projects/UploadFile";
import Profile from "./components/logAndRegStudent/Profile";
import ForgotPassword from "./components/logAndRegStudent/ForgotPassword";
import MyProjects from "./components/projects/MyProjects";
import ProjectDetails from "./components/projects/ProjectDetails";

export {
    createBrowserRouter,
    RouterProvider,
    PrivateRouteStudents,
    PrivateRouteInstructor,
    LoginStudents,
    RegisterStudent,
    RegisterInstructor,
    HomeStudent,
    OpenPro,
    HomeInstructor,
    PageOne,
    PageTwo,
    MainLayout,
    LoginInstructor,
    UpFile,
    Profile,
    ForgotPassword,
    MyProjects,
    ProjectDetails
};
