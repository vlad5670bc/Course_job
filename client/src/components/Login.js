import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../services/api';

function Login() {
    const [loginData, setLoginData] = useState({ name: '', surname: '', lastname: '', password: '' });
    const [error, setError] = useState('');
    const { setUserRole } = useAuth(); // Import the context function to set the role
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Step 1: Authenticate the user
            const res = await api.post('/api/login', loginData);

            // Step 2: Fetch the user's role
            const { data: userRole } = await api.get('/api/usersRole', {
                params: { name: loginData.name, surname: loginData.surname, lastname: loginData.lastname }
            });

            // Step 3: Set the user role in the auth context
            setUserRole(userRole.role);
            navigate('/collections')
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Such user not found');
            } else if (err.response && err.response.status === 401) {
                setError('Invalid login credentials');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Вхід</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Ім'я</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Ім'я"
                    onChange={handleChange}
                    required
                />
                <label>Прізвище</label>
                <input
                    type="text"
                    name="surname"
                    placeholder="Прізвище"
                    onChange={handleChange}
                    required
                />
                <label>По-батькові</label>
                <input
                    type="text"
                    name="lastname"
                    placeholder="По-батькові"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль користувача"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Увійти</button>
            </form>
            <div className="link-login">
                <Link to="/register">Я не маю акаунту</Link>
            </div>
        </div>
    );
}

export default Login;
