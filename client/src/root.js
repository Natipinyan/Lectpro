import { RouterProvider } from "react-router-dom";
import MyRouter from './services/MyRouter';

export default function Root() {
    return (
        <>
            <div className={"test"} style={{ height: "250px", backgroundColor: "green" }}>Header</div>
                <RouterProvider router={MyRouter} />
            <div className={"test"} style={{ width: "100%", height: "250px", backgroundColor: "green", position: "absolute", bottom: 0 }}>Footer</div>
        </>
    );
}
