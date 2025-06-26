import * as Imports from "./imports";

const onLoginSuccess = () => {
    console.log("Login successful!");
};

export default function BaseRouter() {
    const router = Imports.createBrowserRouter([
        {
            path: "/students",
            children: [
                { index: true, element: <Imports.PublicRouteStudents element={Imports.LoginSignupFormSTD} /> },
                { path: "forgot-password", element: <Imports.ForgotPasswordSTD /> },
                { path: "HomeStudent", element: <Imports.PrivateRouteStudents element={Imports.HomeStudent} /> },
                {
                    element: <Imports.SidebarLayout />,
                    children: [
                        { path: "pageOne", element: <Imports.PrivateRouteStudents element={Imports.PageOne} /> },
                        { path: "pageTwo", element: <Imports.PrivateRouteStudents element={Imports.PageTwo} /> },
                        { path: "upload", element: <Imports.PrivateRouteStudents element={Imports.OpenPro} /> },
                        { path: "UpFile", element: <Imports.PrivateRouteStudents element={Imports.UpFile} /> },
                        { path: "Profile", element: <Imports.PrivateRouteStudents element={Imports.ProfileSTD} /> },
                        { path: "MyProjects", element: <Imports.PrivateRouteStudents element={Imports.MyProjects} /> },
                        { path: "project/:projectId", element: <Imports.PrivateRouteStudents element={Imports.ProjectDetails} /> },
                        { path: "EditProject/:projectId", element: <Imports.PrivateRouteStudents element={Imports.EditProject} /> }
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
                    element: <Imports.SidebarLayout />,
                    children: [
                        { path: "pageOne", element: <Imports.PrivateRouteInstructor element={Imports.PageOne} /> },
                        { path: "pageTwo", element: <Imports.PrivateRouteInstructor element={Imports.PageTwo} /> },
                        { path: "upload", element: <Imports.PrivateRouteInstructor element={Imports.OpenPro} /> },
                        { path: "UpFile", element: <Imports.PrivateRouteInstructor element={Imports.UpFile} /> },
                        { path: "Profile", element: <Imports.PrivateRouteInstructor element={Imports.ProfileINS} /> },
                        { path: "MyProjects", element: <Imports.PrivateRouteInstructor element={Imports.MyProjects} /> },
                        { path: "project/:projectId", element: <Imports.PrivateRouteInstructor element={Imports.ProjectDetails} /> },
                        { path: "EditProject/:projectId", element: <Imports.PrivateRouteInstructor element={Imports.EditProject} /> }
                    ],
                },
            ],
        },
    ]);

    return <Imports.RouterProvider router={router} />;
}