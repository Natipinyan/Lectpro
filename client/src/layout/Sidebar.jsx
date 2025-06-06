import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faSignInAlt, faUser, faPlusCircle, faFolderOpen, faUpload } from '@fortawesome/free-solid-svg-icons';

const buttons = [
    { icon: faBars, label: 'תפריט', page: '/menu' },
    { icon: faHouse, label: 'בית', page: '/students/HomeStudent' },
    { icon: faSignInAlt, label: 'התחברות', page: '/students' },
    { icon: faUser, label: 'אזור אישי', page: '/students/profile' },
    { icon: faPlusCircle, label: 'הוסף פרויקט', page: '/students/upload' },
    { icon: faFolderOpen, label: 'הפרויקטים שלי', page: '/students/MyProjects' },
    { icon: faUpload, label: 'העלה קובץ', page: '/students/UpFile' },
];

const Sidebar = () => {
    const navigate = useNavigate();

    const handleNavigate = (page) => {
        navigate(page);
    };

    return (
        <aside className="sidebar">
            <div className="left">
                <h2>תפריט</h2>
                <div className="spacer"></div>
                {buttons.map((btn, index) => (
                    <button key={index}>
                        <FontAwesomeIcon icon={btn.icon} />
                    </button>
                ))}
            </div>

            <div className="right">
                <h1>lectpro</h1>
                <nav className="buttons">
                    {buttons
                        .filter((btn) => btn.icon !== faBars)
                        .map((btn, index) => (
                            <button key={index} onClick={() => handleNavigate(btn.page)}>
                                <FontAwesomeIcon icon={btn.icon} />
                                <span>{btn.label}</span>
                            </button>
                        ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;