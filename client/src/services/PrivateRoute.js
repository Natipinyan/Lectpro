import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const userCookie = Cookies.get('user');

    if (!userCookie) {
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
};

export default PrivateRoute;
