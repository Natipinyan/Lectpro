import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginSTD from "./components/logAndRegStudent/LoginSTD";
import RegisterSTD from "./components/logAndRegStudent/RegisterSTD";
import ForgotPasswordSTD from "./components/logAndRegStudent/ForgotPasswordSTD";
import LoginSignupFormSTD from "./components/logAndRegStudent/LoginSignupFormSTD";
import ProfileSTD from "./components/logAndRegStudent/ProfileSTD";







import PrivateRouteStudents from "./services/PrivateRouteStudents";
import PublicRouteStudents from "./services/PublicRouteStudents";
import PrivateRouteInstructor from "./services/PrivateRouteInstructor";
import PublicRouteInstructor from "./services/PublicRouteInstructor";

import HomeStudent from "./components/base/HomeStudents";
import OpenPro from "./components/projects/OpenPro";
import HomeInstructor from "./components/base/HomeInstructor";
import PageOne from "./components/base/PageOne";
import PageTwo from "./components/base/PageTwo";
import MainLayout from "./layout/MainLayout";
import UpFile from "./components/projects/UploadFile";
import MyProjects from "./components/projects/MyProjects";
import ProjectDetails from "./components/projects/ProjectDetails";
import Sidebar  from "./layout/Sidebar";
import SidebarLayout from "./layout/SidebarLayout ";
import EditProject from "./components/projects/EditPtoject";
import LoginINS from "./components/logAndRegInstructor/LoginINS";
import RegisterINS from "./components/logAndRegInstructor/RegisterINS";
import ForgotPasswordINS from "./components/logAndRegInstructor/ForgotPasswordINS";
import LoginSignupFormINS from "./components/logAndRegInstructor/LoginSignupFormINS";
import ProfileINS from "./components/logAndRegInstructor/ProfileINS";

export {
    LoginSTD,
    RegisterSTD,
    ForgotPasswordSTD,
    LoginSignupFormSTD,
    ProfileSTD,

    createBrowserRouter,
    RouterProvider,
    PrivateRouteStudents,
    PublicRouteStudents,
    PrivateRouteInstructor,
    PublicRouteInstructor,
    SidebarLayout,
    HomeStudent,
    OpenPro,
    HomeInstructor,
    PageOne,
    PageTwo,
    MainLayout,
    UpFile,
    MyProjects,
    ProjectDetails,
    Sidebar,
    EditProject,
    LoginINS,
    RegisterINS,
    ForgotPasswordINS,
    LoginSignupFormINS,
    ProfileINS,
};
