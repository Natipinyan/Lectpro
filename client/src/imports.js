import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Cookie check for students
import PrivateRouteStudents from "./services/PrivateRouteStudents";
import PublicRouteStudents from "./services/PublicRouteStudents";

// Base components for students
import LoginSTD from "./components/logAndRegStudent/LoginSTD";
import RegisterSTD from "./components/logAndRegStudent/RegisterSTD";
import ForgotPasswordSTD from "./components/logAndRegStudent/ForgotPasswordSTD";
import LoginSignupFormSTD from "./components/logAndRegStudent/LoginSignupFormSTD";
import ProfileSTD from "./components/logAndRegStudent/ProfileSTD";
import SidebarLayoutSTD from "./layout/SidebarLayoutSTD";
import HomeStudent from "./components/base/HomeStudents";

// Components for students
import OpenPro from "./components/projects/OpenPro";
import UpFile from "./components/projects/UploadFile";
import MyProjects from "./components/projects/MyProjects";
import ProjectDetails from "./components/projects/ProjectDetails";
import EditProject from "./components/projects/EditPtoject";

// Cookie check for instructors
import PrivateRouteInstructor from "./services/PrivateRouteInstructor";
import PublicRouteInstructor from "./services/PublicRouteInstructor";

// Base components for instructors
import LoginINS from "./components/logAndRegInstructor/LoginINS";
import RegisterINS from "./components/logAndRegInstructor/RegisterINS";
import ForgotPasswordINS from "./components/logAndRegInstructor/ForgotPasswordINS";
import LoginSignupFormINS from "./components/logAndRegInstructor/LoginSignupFormINS";
import ProfileINS from "./components/logAndRegInstructor/ProfileINS";
import SidebarLayoutINS from "./layout/SidebarLayoutINS";
import HomeInstructor from "./components/base/HomeInstructor";

export {
    // React Router dependencies
    createBrowserRouter,
    RouterProvider,

    // Student authentication and routes
    PrivateRouteStudents,
    PublicRouteStudents,
    LoginSTD,
    RegisterSTD,
    ForgotPasswordSTD,
    LoginSignupFormSTD,
    ProfileSTD,
    SidebarLayoutSTD,
    HomeStudent,

    // Student project components
    OpenPro,
    UpFile,
    MyProjects,
    ProjectDetails,
    EditProject,

    // Instructor authentication and routes
    PrivateRouteInstructor,
    PublicRouteInstructor,
    LoginINS,
    RegisterINS,
    ForgotPasswordINS,
    LoginSignupFormINS,
    ProfileINS,
    SidebarLayoutINS,
    HomeInstructor,
};