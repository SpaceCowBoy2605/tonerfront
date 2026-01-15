import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

export default function TablaToners() {

    return (
        <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <Link to="/toners" className="nav-link">Toners</Link>
                </li>
                <li className="nav-item">
                   <Link to="/tabla-toners" className="nav-link">Tabla de Toners</Link>
                </li>
                <li className="nav-item">
                    <Link to="/actualizar-toners" className="nav-link">Actualizar Toners</Link>                </li>
            </ul>
            <h2>Tabla de Toners</h2>
        </div>        
    );

}