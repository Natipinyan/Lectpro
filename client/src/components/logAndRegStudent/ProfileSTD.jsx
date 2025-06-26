import React, { useState, useEffect } from "react";
import { fetchUserData, updateUserData } from "../../services/api";
import ProfileForm from "./ProfileFormSTD";
import NotificationPopup from "../projects/NotificationPopup";
import "../../css/logAndReg/profile.css";

export default function ProfileSTD() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);
                setLoading(false);
                if (!data || data.length === 0) {
                    setNotification({
                        message: "לא נמצאו נתונים עבור המשתמש.",
                        type: "error"
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                setNotification({
                    message: "שגיאה בטעינת נתוני המשתמש",
                    type: "error"
                });
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    useEffect(() => {
        if (userData && userData.length > 0) {
            setFormData({
                user_name: userData[0].user_name || "",
                first_name: userData[0].first_name || "",
                last_name: userData[0].last_name || "",
                email: userData[0].email || "",
                phone: userData[0].phone || "",
                pass: "",
            });
        }
    }, [userData]);

    const handleSave = async () => {
        try {
            const dataToSend = { ...formData };
            if (!formData.pass) {
                delete dataToSend.pass;
            }
            await updateUserData(dataToSend);
            const updatedData = await fetchUserData();
            setUserData(updatedData);
            setIsEditing(false);
            setNotification({
                message: "הנתונים עודכנו בהצלחה!",
                type: "success"
            });
        } catch (error) {
            console.error("Error updating user data:", error.message);
            setNotification({
                message: "שגיאה בעדכון הנתונים",
                type: "error"
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            user_name: userData?.[0]?.user_name || "",
            first_name: userData?.[0]?.first_name || "",
            last_name: userData?.[0]?.last_name || "",
            email: userData?.[0]?.email || "",
            phone: userData?.[0]?.phone || "",
            pass: "",
        });
    };

    if (loading) {
        return (
            <div className="profile-wrapper">
                <div className="profile-container">
                    <h1 className="profile-title">פרופיל משתמש</h1>
                    <div className="loading">טעינה...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h1 className="profile-title">פרופיל משתמש</h1>
                {notification && (
                    <NotificationPopup
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
                {userData && userData.length > 0 ? (
                    <ProfileForm
                        userData={userData[0]}
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ) : null}
            </div>
        </div>
    );
}