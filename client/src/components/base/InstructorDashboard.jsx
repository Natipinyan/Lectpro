import React, { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import "../../css/base/InstructorDashboard.css";

export default function InstructorDashboard() {
    const [dashboardData, setDashboardData] = useState(null);

    const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA00FF", "#FF4567"];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/dashboard`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();
                console.log("Dashboard data:", data);
                if (data.success === 200) setDashboardData(data.data);
            } catch (err) {
                console.error("❌ Error fetching dashboard:", err);
            }
        };
        fetchDashboard();
    }, []);

    if (!dashboardData) return <p>טוען נתונים...</p>;

    const projectsStatusData = [
        { name: "בתהליך", value: parseInt(dashboardData.projectsStatus.in_progress) },
        { name: "הסתיימו", value: parseInt(dashboardData.projectsStatus.finished) },
    ];

    const projectsProgressData = dashboardData.projectsProgress.map(p => ({
        title: p.title,
        doneStages: parseInt(p.done_stages),
        totalStages: p.total_stages
    }));

    const commentsData = [
        { name: "בוצע", value: parseInt(dashboardData.commentsSummary.done_comments) },
        { name: "לא בוצע", value: parseInt(dashboardData.commentsSummary.total_comments) - parseInt(dashboardData.commentsSummary.done_comments) }
    ];

    const technologiesData = dashboardData.technologiesUsage.map(t => ({
        name: t.tech_language,
        value: t.project_count
    }));

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <h2 className="dashboard-title">📌 דשבורד מרצה</h2>
                <div className="project-count">סה"כ פרויקטים: <strong>{dashboardData.projectCount.project_count}</strong></div>
            </div>

            <div className="dashboard-top">
                <div className="card">
                    <h3 className="card-title">סטטוס פרויקטים</h3>
                    <PieChart width={300} height={250}>
                        <Pie
                            data={projectsStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            labelLine={true}
                            label={({ cx, cy, midAngle, outerRadius, index }) => {
                                const radius = outerRadius + 35;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (
                                    <text x={x} y={y} fill="#333" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                                        {projectsStatusData[index].value}
                                    </text>
                                );
                            }}
                        >
                            {projectsStatusData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                <div className="card">
                    <h3 className="card-title">סיכום הערות</h3>
                    <PieChart width={300} height={250}>
                        <Pie
                            data={commentsData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            labelLine={true}
                            label={({ cx, cy, midAngle, outerRadius, index }) => {
                                const radius = outerRadius + 35;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (
                                    <text x={x} y={y} fill="#333" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                                        {commentsData[index].value}
                                    </text>
                                );
                            }}
                        >
                            {commentsData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                <div className="card">
                    <h3 className="card-title">טכנולוגיות בפרויקטים</h3>
                    {technologiesData.length > 0 ? (
                        <PieChart width={300} height={250}>
                            <Pie
                                data={technologiesData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                labelLine={true}
                                label={({ cx, cy, midAngle, outerRadius, index }) => {
                                    const radius = outerRadius + 35;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                    return (
                                        <text x={x} y={y} fill="#333" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                                            {technologiesData[index].value}
                                        </text>
                                    );
                                }}
                            >
                                {technologiesData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    ) : (
                        <p>לא נמצאו טכנולוגיות בשימוש בפרויקטים שלך.</p>
                    )}
                </div>

            </div>

            <div className="dashboard-bottom">
                <BarChart width={window.innerWidth * 0.9} height={window.innerHeight * 0.45} data={projectsProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="doneStages" fill="#82ca9d" name="שלבים בוצעו" />
                    <Bar dataKey="totalStages" fill="#8884d8" name="סך הכל שלבים" />
                </BarChart>
            </div>

        </div>
    );
}
