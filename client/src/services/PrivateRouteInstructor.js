import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRouteStudents = ({ element: Component, ...rest }) => {
    const userCookie = Cookies.get('instructor');

    if (!userCookie) {
        return <Navigate to="/instructor" />;
    }

    return <Component {...rest} />;
};

export default PrivateRouteStudents;