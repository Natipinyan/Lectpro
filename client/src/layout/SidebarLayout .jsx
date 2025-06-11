import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function SidebarLayout() {
    return (
        <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw" }}>
            <div style={{
                flexShrink: 0,
                boxSizing: "border-box",
            }}>
                <Sidebar />
            </div>

            <div style={{ display: "flex", flexDirection: "row-reverse", minHeight: "100vh", width: "100vw" }}>

            <div style={{
                    width: "100%",
                    boxSizing: "border-box",
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
