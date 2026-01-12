import { useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'

export default function Home() {
    const [accesorios, setAccesorios] = useState([])

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
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0">
            <h2>Tabla de toners</h2>
            <Boton />
            <BotonCancelar />
            <table className="table">
                <thead>
                    <tr>
                        <th id="scrollspyHeading2" scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Factura</th>
                        <th scope="col">Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {accesorios.map((accesorio) => (
                        <tr key={accesorio.id}>
                            <th scope="row">{accesorio?.id}</th>
                            <td>{accesorio?.nombreAccesorio ?? ''}</td>
                            <td>{accesorio?.cantidad ?? ''}</td>
                            <td>{accesorio?.fecha ?? accesorio?.entrada ?? ''}</td>
                            <td>{accesorio?.idfactura ?? ''}</td>
                            <td>{accesorio?.idEstatus ?? ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
