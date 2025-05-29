import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/base/homeStudent.css"

const HomeStudents = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="home-students-container">
            <button onClick={() => handleNavigate("/students/upload")}>פתיחת פרוייקט</button>
            <button onClick={() => handleNavigate("/students/profile")}>איזור אישי</button>
            <button onClick={() => handleNavigate("/students/my-projects")}>הפרוייקטים שלי</button>
        </div>
    );
};

export default HomeStudents;
