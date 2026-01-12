import React from "react";
import logo from '../../assets/logotoner.png';

export const Header = () => {
    return (
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <img src={logo} alt="Toner App logo" width="70" height="52" className="me-2" />
                <h1>Toner App</h1>
            </a>
            <ul className="nav nav-pills"> 
                <li className="nav-item"><a href="#" className="nav-link active" aria-current="page">Home</a></li> 
                <li className="nav-item"><a href="#" className="nav-link">Features</a></li> 
                <li className="nav-item"><a href="#" className="nav-link">Pricing</a></li> 
                <li className="nav-item"><a href="#" className="nav-link">FAQs</a></li> 
                <li className="nav-item"><a href="#" className="nav-link">About</a></li>
            </ul> 
        </header>
    );
}

export default Header;