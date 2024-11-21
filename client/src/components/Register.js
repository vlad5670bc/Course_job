import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../services/api';
import '../css/login.css';

function Register() {
    const [registerData, setRegisterData] = useState({ login: '', password: '', userRole: '' });
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const { setUserRole } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Check password constraints when user changes password field
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        // Check if password length is at least 10 characters
        if (password.length < 10) {
            setPasswordError('Пароль має бути не менше 10 символів');
            setPasswordStrength('');
            return;
        } else {
            setPasswordError('');
        }

        // Determine password strength
        if (/^[a-zA-Z]+$/.test(password)) {
            setPasswordStrength('Не надійний');
        } else if (/^[a-zA-Z0-9]+$/.test(password)) {
            setPasswordStrength('Середній');
        } else if (/[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordStrength('Важкий');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any previous error before the new request

        if (passwordError) {
            setError('Please fix the password requirements before submitting.');
            return;
        }

        try {
            await api.post('/api/register', registerData);
            setUserRole(registerData.userRole); // Set userRole in context after successful registration
            navigate('/login'); // Redirect on success
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <h2>Реєстрація</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Ім'я" 
                    value={registerData.name} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="surname" 
                    placeholder="Прізвище" 
                    value={registerData.surname} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="lastname" 
                    placeholder="По-батькові" 
                    value={registerData.lastname} 
                    onChange={handleChange} 
                    required 
                />
                {passwordError && <p className="error-text">{passwordError}</p>}
                {passwordStrength && (
                    <p className={`password-strength ${passwordStrength}`}>
                        Strength: {passwordStrength}
                    </p>
                )}
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Пароль користувача" 
                    value={registerData.password} 
                    onChange={handleChange} 
                    required 
                    className={passwordError ? 'password-error' : ''}
                />
                
                <div className="user-role">
                    <label>
                        Роль користувача
                        <select
                            name="userRole"
                            value={registerData.userRole}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Оберіть роль користувача</option>
                            <option value="cadet">Курсант</option>
                            <option value="command">Командир</option>
                            <option value="doctor">Психотерапевт</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Зареєструватися</button>
            </form>
            <div className="link-login">
                <Link to="/login">Я вже маю акаунт</Link>
            </div>
        </div>
    );
}

export default Register;
