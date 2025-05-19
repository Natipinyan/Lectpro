import React, { useState, useEffect } from "react";
import "../../css/projects/openPro.css";

const OpenPro = () => {
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [technologies, setTechnologies] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState([{ id: "", techType: "" }]);

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

    const addTechnologyField = () => {
        setSelectedTechs([...selectedTechs, { id: "", techType: "" }]);
    };

    const removeTechnologyField = (index) => {
        if (selectedTechs.length > 1) {
            setSelectedTechs(selectedTechs.filter((_, i) => i !== index));
        }
    };

    const handleTechnologyChange = (index, techId) => {
        const updatedTechs = [...selectedTechs];
        const selectedTech = technologies.find((tech) => tech.id === parseInt(techId));
        updatedTechs[index] = {
            id: techId,
            techType: selectedTech ? selectedTech.title : "",
        };
        setSelectedTechs(updatedTechs);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!projectName.trim() || !projectDesc.trim()) {
            alert("יש למלא את שם ותיאור הפרויקט.");
            return;
        }

        const validTechs = selectedTechs.filter((tech) => tech.id && tech.techType);
        if (validTechs.length === 0) {
            alert("יש לבחור לפחות טכנולוגיה אחת תקינה.");
            return;
        }

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
                    selectedTechnologies: validTechs,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("הפרויקט נוסף בהצלחה!");
                setProjectName("");
                setProjectDesc("");
                setSelectedTechs([{ id: "", techType: "" }]);
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

                {selectedTechs.map((tech, index) => (
                    <div className="form-section" key={index}>
                        <label htmlFor={`technology-${index}`} className="formLabel">
                            :בחר טכנולוגיה {index + 1}
                        </label>
                        <select
                            id={`technology-${index}`}
                            className="text-input"
                            value={tech.id}
                            onChange={(e) => handleTechnologyChange(index, e.target.value)}
                            required
                        >
                            <option value="">בחר טכנולוגיה</option>
                            {technologies.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.language}
                                </option>
                            ))}
                        </select>
                        {tech.techType && (
                            <div className="form-section">
                                <label className="formLabel">:סוג טכנולוגיה</label>
                                <p>{tech.techType}</p>
                            </div>
                        )}
                        {selectedTechs.length > 1 && (
                            <button
                                type="button"
                                className="remove-tech-button"
                                onClick={() => removeTechnologyField(index)}
                            >
                                הסר
                            </button>
                        )}
                    </div>
                ))}

                <div className="form-section">
                    <button type="button" className="add-tech-button" onClick={addTechnologyField}>
                        הוסף טכנולוגיה
                    </button>
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