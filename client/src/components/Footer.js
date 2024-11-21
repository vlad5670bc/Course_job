import React from 'react';
import { Link } from 'react-router-dom';
import '../css/login.css'; // Assuming you have a CSS file for styling

const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-content'>
                <p>&copy; {new Date().getFullYear()} Роботу виконав курсант 403 н/г Кондаков Владислав</p>
            </div>
        </footer>
    );
};

export default Footer;
