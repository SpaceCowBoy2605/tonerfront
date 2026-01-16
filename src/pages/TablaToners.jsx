import { useState, useEffect } from 'react'
import Nav from '../components/navs/navsToner.jsx'
import '../style/tablatoner.css'

export default function TablaToners() {

    const [accesorios, setAccesorios] = useState([])

    const getEstatusLabel = (solicitud) => {
        return (
            solicitud?.accesorio?.estatus?.estatus ??
            solicitud?.impresora?.accesorio?.estatus?.estatus ??
            solicitud?.estatus?.estatus ??
            solicitud?.estatus ??
            ''
        )
    }

    const getEstatusClass = (estatus) => {
        switch (estatus) {
            case 'Sufuciente':
                return { backgroundColor: '#56d651', color: '#000000' };
            case 'Bajo':
                return { backgroundColor: '#ecec0e', color: '#020202' };
            case 'Solcitar mas':
                return { backgroundColor: '#e25d5d', color: '#ffffff' };
            case 'Reservado':
                return { backgroundColor: '#ffffff', color: '#1411b3' };
            default:
                return undefined
        }
    }

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/accesorio')
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.accesorios ?? data?.accesorio ?? []);
                setAccesorios(lista);
            })
            .catch(() => setAccesorios([]))
    }, []);

    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <Nav />
            <h2 className="titulo">
                Tabla de Toners
            </h2>
            <div className="table-scroll">
                <table className="table">
                    <thead>
                        <tr>
                            <th id="scrollspyHeading2" scope="col">ID Toner</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accesorios.map((accesorio) => {
                            const estatusLabel = getEstatusLabel(accesorio)
                            return (
                                <tr key={accesorio.id}>
                                    <td>{accesorio.id}</td>
                                    <td>{accesorio.nombreAccesorio}</td>
                                    <td>{accesorio.cantidad}</td>
                                    <td style={getEstatusClass(estatusLabel)}>{estatusLabel}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

}