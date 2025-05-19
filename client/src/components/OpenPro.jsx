import React, { useState, useEffect } from "react";
import "../css/openPro.css";

const OpenPro = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [technologies, setTechnologies] = useState([]);
    const [selectedTechnology, setSelectedTechnology] = useState("");
    const [techType, setTechType] = useState("");
    //chanfe to set type to techType!!!

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const response = await fetch("http://localhost:5000/technology/List", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setTechnologies(data);
                } else {
                    alert("אירעה שגיאה בטעינת הטכנולוגיות");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("שגיאה בחיבור לשרת");
            }
        };

        fetchTechnologies();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!projectName.trim() || !projectDesc.trim() || !selectedTechnology || !techType) {
            alert("יש למלא את כל השדות.");
            return;
        }

        const selectedTechnologies = [selectedTechnology];

        try {
            const response = await fetch("http://localhost:5000/projects/addproject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    projectName,
                    projectDesc,
                    selectedTechnologies,
                    techType,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("הפרויקט נוסף בהצלחה!");
                setProjectName("");
                setProjectDesc("");
                setSelectedTechnology("");
                setTechType("");
            } else {
                alert(data.message || "אירעה שגיאה");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("שגיאה בחיבור לשרת");
        }
    };


    return (
        <div>
            <h1 className="upMessage">:יצירת פרויקט חדש</h1>
            <form id="openPro-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label htmlFor="project-name" className="formLabel">:שם הפרוייקט</label>
                    <input
                        type="text"
                        id="project-name"
                        className="text-input"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="project-desc" className="formLabel">:תיאור הפרוייקט</label>
                    <textarea
                        id="project-desc"
                        className="text-area"
                        rows="4"
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        required
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="technology" className="formLabel">:בחר טכנולוגיה</label>
                    <select
                        id="technology"
                        className="text-input"
                        value={selectedTechnology}
                        onChange={(e) => setSelectedTechnology(e.target.value)}
                        required
                    >
                        <option value="">בחר טכנולוגיה</option>
                        {technologies.map((tech) => (
                            <option key={tech.id} value={tech.id}>
                                {tech.language}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="form-section">
                    <label htmlFor="tech-type" className="formLabel">:בחר סוג טכנולוגיה</label>
                    <select
                        id="tech-type"
                        className="text-input"
                        value={techType}
                        onChange={(e) => setTechType(e.target.value)}
                        required
                    >
                        <option value="">בחר סוג טכנולוגיה</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                    </select>
                </div>

                <div className="button-container">
                    <button className="button" id="toUploadPage" type="submit">
                        ליצירת הפרוייקט
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OpenPro;
