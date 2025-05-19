import {Outlet} from "react-router-dom";
import Header from "../components/base/header";

export default function MainLayout() {
    return(
        <>
            <Header>
            </Header>
            <Outlet>

            </Outlet>

        </>
    )
}