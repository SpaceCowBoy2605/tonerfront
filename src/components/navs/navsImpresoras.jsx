import React from "react";
import { Link } from 'react-router-dom'
import logo from '../../assets/logotoner.webp';


export const NavImpresora  = () => {
    return (
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
                <Link to="" className="nav-link">Impresoras de planta</Link>
            </li>
            <li className="nav-item">
                <Link to="" className="nav-link">Impresoras de Resureccion</Link>
            </li>
            <li className="nav-item">
                <Link to="" className="nav-link">Impresoras de la TEP</Link>
            </li>
            <li className="nav-item">
                <Link to="" className="nav-link">Impresoras de la CEDIS</Link>
            </li>
        </ul>

    );
}

export default NavImpresora;