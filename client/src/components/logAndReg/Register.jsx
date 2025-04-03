import React, { useState } from 'react';
import '../../css/logAndReg/register.css';
import axios from 'axios';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/students/register/Add', {
                userName,
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                pass
            });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error registering user');
            setSuccessMessage('');
        }
    };

    return (
        <div className="registerSection">
            <h2>הרשמה - סטודנטים</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="שם פרטי"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="שם משפחה"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="שם משתמש"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="כתובת אימייל"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="מספר טלפון"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="סיסמה"
                    />
                </div>
                <div>
                    <button className="submit" type="submit">הרשמה</button>
                </div>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default Register;