import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/base/homeStudent.css"

const HomeStudents = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/students/upload");
    };

    return (
        <div className="home-students-container">
            <button onClick={handleNavigate}>פתיחת פרוייקט</button>
            <button>איזור אישי</button>
            <button>הפרוייקטים שלי</button>
        </div>
    );
};

export default HomeStudents;
