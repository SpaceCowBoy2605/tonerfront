import { useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'

export default function Home() {
    const [solicitudes, setSolicitudes] = useState([])

    const getNombreAccesorio = (solicitud) => {
        return solicitud?.accesorio?.nombreAccesorio ?? solicitud?.nombreAccesorio ?? ''
    }

    const getImpresoraLabel = (solicitud) => {
        const nombre = solicitud?.impresora?.nombreImpresora ?? ''
        const modelo = solicitud?.impresora?.modelo ?? ''
        const etiqueta = [nombre, modelo].filter(Boolean).join(' ')
        return etiqueta || (solicitud?.idImpresora ?? '')
    }

    const formatFecha = (valor) => {
        if (!valor) return ''
        const dt = new Date(valor)
        return Number.isNaN(dt.getTime()) ? String(valor) : dt.toLocaleDateString('es-MX')
    }

    const getEstatusLabel = (solicitud) => {
        return (
            solicitud?.accesorio?.estatus?.estatus ??
            solicitud?.impresora?.accesorio?.estatus?.estatus ??
            solicitud?.estatus?.estatus ??
            solicitud?.estatus ??
            ''
        )
    }

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
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <h2>Tabla de solicitudes</h2>
            <div className='container mb-4 p-3'>
                <Boton />
                <BotonCancelar />
            </div>
            <div className="table-scroll">
                <table className="table">
                    <thead>
                        <tr>
                            <th id="scrollspyHeading2" scope="col">Id de orden</th>
                            <th scope="col">Accesorio solicitado</th>
                            <th scope="col">Impresora compatible</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Centro de costos</th>
                            {/* <th scope="col">Estatus</th> */}
                        </tr>
                    </thead>
                    <tbody className='cuerpoT'>
                        {solicitudes.map((solicitud) => {
                            const estatusLabel = getEstatusLabel(solicitud)
                            return (
                                <tr key={solicitud.id}>
                                    <th scope="row">{solicitud?.id}</th>
                                    <td>{getNombreAccesorio(solicitud)}</td>
                                    <td>{getImpresoraLabel(solicitud)}</td>
                                    <td>{solicitud?.cantidad ?? ''}</td>
                                    <td>{formatFecha(solicitud?.fechaSolicitud)}</td>
                                    <td>{solicitud?.centroCostos ?? ''}</td>
                                    {/* <td style={getEstatusClass(estatusLabel)}>{estatusLabel}</td> */}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
