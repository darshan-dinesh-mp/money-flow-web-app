import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Email:', email);
            console.log('Password:', password);
            const response = await fetch('https://money-flow-web-app-1.onrender.com/api/login', {
            // const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            console.log('Response:', result.message);
            if (result.message) {
                localStorage.setItem('userId', result.userData.uid);
                localStorage.setItem('username', result.userData.name);
                setSuccess(result.message);
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.loginContainer}>
                <div className={styles.title}>
                    <h3>Login<span> to view your transactions</span></h3>
                </div>
                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <div className={styles.formField}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className={styles.loginButton} type="submit">Login</button>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                </form>
                <p>
                    Don't have an account? <Link to="/signup">Signup here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
