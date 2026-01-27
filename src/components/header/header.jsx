import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logotoner.webp";
import "../../style/header.css";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false); // cierra al navegar
    }, [location.pathname]);

    return (
        <header className="app-header d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <Link to="/" className="d-flex align-items-center me-auto link-body-emphasis text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="Toner App logo" width="70" height="62" className="me-2" />
                <h1>Toner App</h1>
            </Link>
            <button type="button" className="hamburger-btn" aria-label="Abrir menú" aria-expanded={isMenuOpen} aria-controls="main-nav" onClick={() => setIsMenuOpen((v) => !v)} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                </svg>
            </button>
            <ul id="main-nav" className={`nav nav-pills ${isMenuOpen ? "is-open" : ""}`}>
                <li className="nav-item">
                    <Link to="/" className="nav-link" aria-current="page" onClick={() => setIsMenuOpen(false)}>
                        Inicio
                    </Link>
                </li>
                <li className="nav-item"><Link to="/toners" className="nav-link" onClick={() => setIsMenuOpen(false)}>Toners</Link></li>
                <li className="nav-item"><Link to="/impresoras" className="nav-link" onClick={() => setIsMenuOpen(false)}>Impresoras</Link></li>
                <li className="nav-item"><Link to="/faqs" className="nav-link" onClick={() => setIsMenuOpen(false)}>FAQs</Link></li>
                <li className="nav-item"><Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            </ul>
        </header>
    );
};

export default Header;