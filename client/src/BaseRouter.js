import * as Imports from "./imports";

// const onLoginSuccess = () => {
//     console.log("Login successful!");
// };

export default function BaseRouter() {
    const router = Imports.createBrowserRouter([
        {
            path: "/students",
            children: [
                { index: true, element: <Imports.PublicRouteStudents element={Imports.LoginSignupFormSTD} /> },
                { path: "forgot-password", element: <Imports.ForgotPasswordSTD /> },
                { path: "HomeStudent", element: <Imports.PrivateRouteStudents element={Imports.HomeStudent} /> },
                {
                    element: <Imports.SidebarLayoutSTD />,
                    children: [
                        { path: "upload", element: <Imports.PrivateRouteStudents element={Imports.OpenPro} /> },
                        { path: "UpFile", element: <Imports.PrivateRouteStudents element={Imports.UpFile} /> },
                        { path: "Profile", element: <Imports.PrivateRouteStudents element={Imports.ProfileSTD} /> },
                        { path: "MyProjects", element: <Imports.PrivateRouteStudents element={Imports.MyProjects} /> },
                        { path: "project/:projectId", element: <Imports.PrivateRouteStudents element={Imports.ProjectDetails} /> },
                        { path: "EditProject/:projectId", element: <Imports.PrivateRouteStudents element={Imports.EditProject} /> },
                        { path: "comments/:projectId", element: <Imports.PrivateRouteStudents element={Imports.Comment} /> }
                    ],
                },
            ],
        },
        {
            path: "/instructor",
            children: [
                { index: true, element: <Imports.PublicRouteInstructor element={Imports.LoginSignupFormINS} /> },
                { path: "forgot-password", element: <Imports.ForgotPasswordINS /> },
                { path: "HomeInstructor", element: <Imports.PrivateRouteInstructor element={Imports.HomeInstructor} /> },
                {
                    element: <Imports.SidebarLayoutINS />,
                    children: [
                        { path: "Profile", element: <Imports.PrivateRouteInstructor element={Imports.ProfileINS} /> },
                        { path: "MyProjects", element: <Imports.PrivateRouteInstructor element={Imports.InstructorProjects} /> },
                        { path: "project/:projectId", element: <Imports.PrivateRouteInstructor element={Imports.InstructorProjectDetails} /> },
                        { path: "comments/:projectId", element: <Imports.PrivateRouteInstructor element={Imports.InstructorComment} /> }

                    ],
                },
            ],
        }
    ]);

    return <Imports.RouterProvider router={router} />;
}