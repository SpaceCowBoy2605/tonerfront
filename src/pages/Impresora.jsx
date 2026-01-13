import { useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import BotonEditar from '../components/buttons/BotonEditar.jsx'
import hp107 from '../assets/hp107.avif';

export default function Impresoras() {

    const [impresoras, setImpresoras] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/impresora')
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.impresoras ?? data?.impresora ?? []);
                setImpresoras(lista);
            })
            .catch(() => setImpresoras([]))
    }, []);

    return (
        <div className="row">
            {impresoras.map((impresora) => (
                <div key={impresora.id} className="col-sm-6 mb-3 mb-sm-0">
                    <div className="card">
                        <div className="card-body">
                            <img src={hp107} alt="Impresora" className="card-img-top" />
                            <h5 className="card-title">{impresora.nombreImpresora}</h5>
                            <p className="card-text">{impresora.modelo}</p>
                        <BotonEditar />
                    </div>
                </div>
            </div>
            ))}
        </div>
    );
}