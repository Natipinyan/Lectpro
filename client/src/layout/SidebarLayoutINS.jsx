import { Outlet } from "react-router-dom";
import SidebarINS from "./SidebarINS";

export default function SidebarLayoutINS() {
    return (
        <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw" }}>
            <div style={{
                flexShrink: 0,
                boxSizing: "border-box",
            }}>
                <SidebarINS />
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
