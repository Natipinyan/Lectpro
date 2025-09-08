import React, { useState, useEffect } from "react";
import "../../css/base/NotificationsDropdown.css";

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/notifications`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="notifications-list">
            {notifications.map(n => (
                <div key={n.id} className="notification-item">
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <small>{new Date(n.created_at).toLocaleString()}</small>
                </div>
            ))}
            {loading && <p>טוען...</p>}
            {!loading && notifications.length === 0 && <p>אין התראות</p>}
        </div>
    );
}
