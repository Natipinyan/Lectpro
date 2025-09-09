import React, { useState, useEffect, useRef } from "react";
import "../../css/base/NotificationsDropdown.css";

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const effectRan = useRef(false);

    const fetchNotifications = async () => {
        setLoading(true);
        console.log("Fetching notifications...");
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
        if (!effectRan.current) {
            fetchNotifications();
            effectRan.current = true;
        }
    }, []);

    return (
        <div className="notifications-list">
            {notifications.map(n => (
                <div
                    key={n.id}
                    className={`notification-item ${n.is_read ? "" : "new"}`}
                >
                    {!n.is_read && <span className="new-dot"></span>}
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
