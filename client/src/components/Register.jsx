import React, { useState } from 'react';
import '../css/register.css'
import axios from 'axios';


const Register = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/register/Add', {
                userName,
                email,
                name,
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
        <div className={"registerSection"}  >
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your Name"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <button className={"submit"} type="submit">Register</button>
                </div>

            </form>
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
        </div>
    );
};

export default Register;
