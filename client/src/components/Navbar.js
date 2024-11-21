// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';

const Navbar = () => {

    return (
        <nav className="navbar">
            <div className='navbar-logo'>
                <a href='https://mitit.mil.gov.ua/'><img src={logo} alt='Logo'/></a>
            </div>
            <ul>
                <li><Link to="/">Вийти</Link></li>
                <li><Link to="/collections">Підрозділи</Link></li>
            </ul>
        </nav>
    );
};


export default Navbar;
