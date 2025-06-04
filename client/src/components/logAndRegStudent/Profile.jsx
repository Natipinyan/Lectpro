import React, { useState, useEffect } from "react";
import { fetchUserData, updateUserData } from "../../services/api";
import ProfileForm from "./ProfileForm";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                setError("שגיאה בטעינת נתוני המשתמש");
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
            await updateUserData(formData);
            const updatedData = await fetchUserData();
            setUserData(updatedData);
            setIsEditing(false);
            alert("הנתונים עודכנו בהצלחה!");
        } catch (error) {
            console.error("Error updating user data:", error.message);
            setError("שגיאה בעדכון הנתונים");
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
        return <div>טעינה...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ direction: "rtl", textAlign: "right", fontFamily: "Arial, sans-serif" }}>
            <h1>פרופיל משתמש</h1>
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
            ) : (
                <div>לא נמצאו נתונים עבור המשתמש.</div>
            )}
        </div>
    );
}