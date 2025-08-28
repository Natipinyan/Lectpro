import React from "react";
import { useNavigate } from "react-router-dom";
import '../../css/base/HomePage.css';
import logo from '../../logoMin.png'

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <img src={logo} alt="Logo" className="home-logo" />
                <h1>ברוכים הבאים למערכת שלנו</h1>
                <p>
                    מערכת לניהול מגמות, מעקב סטודנטים, וממשק אישי למרצים וסטודנטים.
                    כאן תוכלו לנהל את כל המידע בצורה נוחה ויעילה.
                </p>
            </header>

            <div className="home-links">
                <button onClick={() => navigate("open-department")} className="home-btn">
                    פתיחת מגמה
                </button>

                <button onClick={() => navigate("/instructor")} className="home-btn">
                    אזור אישי מרצים
                </button>

                <button onClick={() => navigate("/students")} className="home-btn">
                    אזור אישי סטודנטים
                </button>
            </div>

        </div>
    );
};

export default HomePage;
