import React, { useState, useEffect } from "react";
import '../../css/projects/grades.css';

const Grades = ({ projectId }) => {
    const [stages, setStages] = useState([]);
    const [currentStage, setCurrentStage] = useState(null);

    useEffect(() => {
        const fetchProjectStages = async () => {
            try {
                const url = `${process.env.REACT_APP_BASE_URL}/stages/projectStages/${projectId}`
                const res = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                setStages(data.data.allStages || []);
                setCurrentStage(data.data.currentStage || null);
            } catch (err) {
                console.error("שגיאה בשליפת שלבים:", err);
            }
        };

        if (projectId) fetchProjectStages();
    }, [projectId]);

    const currentIndex = currentStage
        ? stages.findIndex(s => s.id === currentStage.id)
        : -1;

    return (
        <div className="progress-container">
            <h3 className="left-grades">פתיחת פרויקט</h3>
            <div className="main-grades">
                <div className="progress-line"></div>
                {stages.map((stage, index) => {
                    const isCompleted = index <= currentIndex;
                    return (
                        <div key={stage.id} className="progress-step">
                            <div className={`circle ${isCompleted ? 'completed' : 'pending'}`}>
                                {isCompleted ? '✔' : '✖'}
                            </div>
                            <div className="stage-name">{stage.title}</div>
                        </div>
                    );
                })}
            </div>
            <h3 className="right-grades">סיום פרויקט</h3>
        </div>
    );
};

export default Grades;
