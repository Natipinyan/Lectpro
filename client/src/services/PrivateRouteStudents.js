import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const PrivateRouteStudents = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/apiStudent/check-auth`, {
                    withCredentials: true,
                });
                //console.log("Check-auth response:", response.data);
                if (isMounted) {
                    setIsAuthenticated(response.data.isAuthenticated);
                }
            } catch (err) {
                console.error("Check-auth failed:", err.response?.data || err.message);
                if (isMounted) {
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/students" replace />;
};

export default PrivateRouteStudents;