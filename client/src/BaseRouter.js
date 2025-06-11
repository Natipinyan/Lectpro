import * as Imports from "./imports";

const onLoginSuccess = () => {
    console.log("Login successful!");
};

export default function BaseRouter() {
    const router = Imports.createBrowserRouter([
        {
            path: "/students",
            children: [
                { index: true, element: <Imports.PublicRouteStudents element={Imports.LoginSignupForm} /> },
                { path: "forgot-password", element: <Imports.ForgotPassword /> },
                {
                    element: <Imports.SidebarLayout />,
                    children: [
                        { path: "HomeStudent", element: <Imports.PrivateRouteStudents element={Imports.HomeStudent} /> },
                        { path: "pageOne", element: <Imports.PrivateRouteStudents element={Imports.PageOne} /> },
                        { path: "pageTwo", element: <Imports.PrivateRouteStudents element={Imports.PageTwo} /> },
                        { path: "upload", element: <Imports.PrivateRouteStudents element={Imports.OpenPro} /> },
                        { path: "UpFile", element: <Imports.PrivateRouteStudents element={Imports.UpFile} /> },
                        { path: "Profile", element: <Imports.PrivateRouteStudents element={Imports.Profile} /> },
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
                { index: true, element: <Imports.LoginInstructor onLoginSuccess={onLoginSuccess} /> },
                { path: "register", element: <Imports.RegisterInstructor /> },
                {
                    element: <Imports.SidebarLayout />,
                    children: [
                        { path: "HomeInstructor", element: <Imports.PrivateRouteInstructor element={Imports.HomeInstructor} /> },
                    ],
                },
            ],
        },
    ]);

    return <Imports.RouterProvider router={router} />;
}