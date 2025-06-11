    import React, { useEffect } from "react";
    import "../../css/projects/notification.css";

    const NotificationPopup = ({ message, type, onClose }) => {
        useEffect(() => {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }, [onClose]);

        return (
            <div className={`notification-popup ${type}`}>
                {message}
            </div>
        );
    };

    export default NotificationPopup;