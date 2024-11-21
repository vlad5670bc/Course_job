// Buffer.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Buffer() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return null; 
}

export default Buffer;
