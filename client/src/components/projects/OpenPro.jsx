import React, { useState } from "react";
import OpenProject from "./AddProject";
import AddTechnology from "./AddTech";
import NotificationPopup from "./NotificationPopup";

const OpenPro = () => {
    const [isAddingTech, setIsAddingTech] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [projectData, setProjectData] = useState({
        projectName: "",
        projectDesc: "",
        linkToGithub: "",
        selectedTechs: [{ id: "", techType: "" }],
    });

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const closeNotification = () => {
        setNotification({ message: "", type: "" });
    };

    const updateProjectData = (newData) => {
        setProjectData((prev) => ({ ...prev, ...newData }));
    };

    const resetProjectData = () => {
        setProjectData({
            projectName: "",
            projectDesc: "",
            linkToGithub: "",
            selectedTechs: [{ id: "", techType: "" }],
        });
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
                    projectData={projectData}
                    updateProjectData={updateProjectData}
                    resetProjectData={resetProjectData}
                />
            )}
        </>
    );
};

export default OpenPro;