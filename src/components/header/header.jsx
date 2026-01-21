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
                <li className="nav-item"><Link to="/" className="nav-link active" aria-current="page"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>Inicio</Link></li>
                <li className="nav-item"><Link to="/toners" className="nav-link">Toners</Link></li>
                <li className="nav-item"><Link to="/impresoras" className="nav-link">Impresoras</Link></li>
                <li className="nav-item"><Link to="/faqs" className="nav-link">FAQs</Link></li>
                <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
            </ul>
        </header>
    );
}

export default Header;