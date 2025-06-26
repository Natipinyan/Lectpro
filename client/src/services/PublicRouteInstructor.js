import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PublicRouteInstructor = ({ element: Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/apiInstructor/external-check-auth`, {
                    withCredentials: true,
                });
                setIsAuthenticated(response.data.data?.isAuthenticated);
            } catch (err) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/instructor/HomeInstructor" replace /> : <Component />;
};

export default PublicRouteInstructor; 