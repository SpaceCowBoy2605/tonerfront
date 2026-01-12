import React from "react";
import { Link } from 'react-router-dom'
import logo from '../../assets/logotoner.webp';

export const Header = () => {
    return (
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <img src={logo} alt="Toner App logo" width="70" height="62" className="me-2" />
                <h1>Toner App</h1>
            </Link>
            <ul className="nav nav-pills"> 
                <li className="nav-item"><Link to="/" className="nav-link active" aria-current="page">Inicio</Link></li>
                <li className="nav-item"><Link to="/features" className="nav-link">Toners</Link></li>
                <li className="nav-item"><Link to="/impresoras" className="nav-link">Impresoras</Link></li>
                <li className="nav-item"><Link to="/faqs" className="nav-link">FAQs</Link></li>
                <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
            </ul> 
        </header>
    );
}

export default Header;