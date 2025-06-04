import React, { useState } from "react";
import OpenProject from "./AddProject";
import AddTechnology from "./AddTech";
import NotificationPopup from "./NotificationPopup";

const OpenPro = () => {
    const [isAddingTech, setIsAddingTech] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const closeNotification = () => {
        setNotification({ message: "", type: "" });
    };

    return (
        <>
            {notification.message && (
                <NotificationPopup
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
            {isAddingTech ? (
                <AddTechnology
                    onBackToProject={() => setIsAddingTech(false)}
                    showNotification={showNotification}
                />
            ) : (
                <OpenProject
                    onSwitchToAddTechnology={() => setIsAddingTech(true)}
                    showNotification={showNotification}
                />
            )}
        </>
    );
};

export default OpenPro;