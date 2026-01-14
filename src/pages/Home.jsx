import { useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'

export default function Home() {
    const [solicitudes, setSolicitudes] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/solicitudes')
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.solicitudes ?? data?.solicitud ?? []);
                setSolicitudes(lista);
            })
            .catch(() => setSolicitudes([]))
    }, []);

    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0">
            <h2>Tabla de solicitudes</h2>
            <div className='botones-container mb-3'>
                <Boton />
                <BotonCancelar />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th id="scrollspyHeading2" scope="col">Id de orden</th>
                        <th scope="col">Accesorio solicitado</th>
                        <th scope="col">Impresora compatible</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Centro de costos</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map((solicitud) => (
                        <tr key={solicitud.id}>
                            <th scope="row">{solicitud?.id}</th>
                            <td>{solicitud?.idAccesorio ?? ''}</td>
                            <td>{solicitud?.idImpresora ?? ''}</td>
                            <td>{solicitud?.cantidad ?? ''}</td>
                            <td>{solicitud?.fechaSolicitud ?? ''}</td>
                            <td>{solicitud?.centroCostos ?? ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
