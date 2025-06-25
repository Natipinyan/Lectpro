import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PublicRouteStudents = ({ element: Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/apiStudent/check-auth`, {
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

    return isAuthenticated ? <Navigate to="/students/HomeStudent" replace /> : <Component />;
};

export default PublicRouteStudents;
