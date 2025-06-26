import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from '../../components/projects/NotificationPopup';
import '../../css/base/homeStudent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';

const HomeInstructor = () => {
    const navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/apiInstructor/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setPopupMessage({ message: "התנתקת בהצלחה", type: "success" });
                setTimeout(() => {
                    navigate('/instructor');
                }, 2000);
            } else {
                setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
            }
        } catch (error) {
            setPopupMessage({ message: "שגיאה בהתנתקות", type: "error" });
        }
    };

    const handleSwitchToStudent = () => {
        navigate('/students');
    };

    return (
        <div className="main-section-home">
            <h1>ברוך הבא מרצה</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                <button className="home-button" onClick={handleSwitchToStudent}>
                    <FontAwesomeIcon icon={faUserGraduate} />
                    <span>מעבר לאיזור סטודנטים</span>
                </button>
                <button className="home-button" onClick={handleLogout}>
                    התנתקות
                </button>
            </div>
            {popupMessage && <NotificationPopup message={popupMessage.message} type={popupMessage.type} />}
        </div>
    );
};

export default HomeInstructor;
