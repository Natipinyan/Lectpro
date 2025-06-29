import React, { useState } from 'react';
import '../../css/logAndReg/register.css';
import axios from 'axios';

const RegisterINS = () => {
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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

        if (!passwordRegex.test(pass)) {
            setErrorMessage('הסיסמה חייבת להיות לפחות 8 תווים, לכלול אות גדולה, אות קטנה, מספר ותו מיוחד. אנא בדוק.');
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/instructor/register/`, {
                userName,
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                pass
            });
            if (response.data.success) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message || 'שגיאה בהרשמה');
                setSuccessMessage('');
            }
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 1500);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'שגיאה בהרשמה');
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 1500);
        }
    };

    return (
        <div className="registerSection">
            <h2>הרשמה - מרצים</h2>
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

export default RegisterINS; 