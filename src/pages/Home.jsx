import { useMemo, useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import BotonSolicitud from '../components/buttons/BotonSolicitud.jsx'

export default function Home() {
    const [solicitudes, setSolicitudes] = useState([])
    const [page, setPage] = useState(1)
    const pageSize = 10

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

    const [plantas, setPlantas] = useState([])
    const [resu, setResu] = useState([])
    const [tep, setTep] = useState([])
    const [cedis, setCedis] = useState([])

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
        fetch(`${API_BASE_URL}/api/solicitudes`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.solicitudes ?? data?.solicitud ?? []);
                setSolicitudes(lista);
                setPage(1);
            })
            .catch(() => setSolicitudes([]))
    }, [API_BASE_URL]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/planta`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.plantas ?? data?.planta ?? [])
                setPlantas(lista)
            })
            .catch(() => setPlantas([]))
    }, [API_BASE_URL])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/resurreccion`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.resurrecciones ?? data?.resurreccion ?? [])
                setResu(lista)
            })
            .catch(() => setResu([]))
    }, [API_BASE_URL])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/tep`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.teps ?? data?.tep ?? [])
                setTep(lista)
            })
            .catch(() => setTep([]))
    }, [API_BASE_URL])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/cedis`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.cedis ?? data?.cedi ?? [])
                setCedis(lista)
            })
            .catch(() => setCedis([]))
    }, [API_BASE_URL])

    const plantasById = useMemo(() => {
        const map = new Map()
        ;(plantas || []).forEach((p) => {
            if (p?.id !== undefined && p?.id !== null) {
                map.set(String(p.id), p?.nombrePlanta ?? p?.nombre ?? '')
            }
        })
        return map
    }, [plantas])

    const resuById = useMemo(() => {
        const map = new Map()
        ;(resu || []).forEach((r) => {
            if (r?.id !== undefined && r?.id !== null) {
                map.set(String(r.id), r?.nombreResurreccion ?? r?.nombreResu ?? r?.nombre ?? '')
            }
        })
        return map
    }, [resu])

    const tepById = useMemo(() => {
        const map = new Map()
        ;(tep || []).forEach((t) => {
            if (t?.id !== undefined && t?.id !== null) {
                map.set(String(t.id), t?.nombreTep ?? t?.nombre ?? '')
            }
        })
        return map
    }, [tep])

    const cedisById = useMemo(() => {
        const map = new Map()
        ;(cedis || []).forEach((c) => {
            if (c?.id !== undefined && c?.id !== null) {
                map.set(String(c.id), c?.nombreCedis ?? c?.nombre ?? '')
            }
        })
        return map
    }, [cedis])

    const getDestinoLabel = (solicitud) => {
        const idCedis = solicitud?.idCedis ?? solicitud?.cedisId ?? solicitud?.id_cedis ?? null
        const idPlanta = solicitud?.idPlanta ?? solicitud?.plantaId ?? solicitud?.id_planta ?? null
        const idResu = solicitud?.idResu ?? solicitud?.resuId ?? solicitud?.id_resu ?? null
        const idTep = solicitud?.idTep ?? solicitud?.tepId ?? solicitud?.id_tep ?? null

        if (solicitud?.cedis?.nombreCedis || solicitud?.cedis?.nombre) {
            const nombre = solicitud.cedis.nombreCedis ?? solicitud.cedis.nombre
            const id = solicitud?.cedis?.id ?? idCedis
            return `Cedis: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (solicitud?.planta?.nombrePlanta || solicitud?.planta?.nombre) {
            const nombre = solicitud.planta.nombrePlanta ?? solicitud.planta.nombre
            const id = solicitud?.planta?.id ?? idPlanta
            return `Planta: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (solicitud?.resu?.nombreResurreccion || solicitud?.resu?.nombreResu || solicitud?.resu?.nombre) {
            const nombre = solicitud.resu.nombreResurreccion ?? solicitud.resu.nombreResu ?? solicitud.resu.nombre
            const id = solicitud?.resu?.id ?? idResu
            return `Resu: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (solicitud?.tep?.nombreTep || solicitud?.tep?.nombre) {
            const nombre = solicitud.tep.nombreTep ?? solicitud.tep.nombre
            const id = solicitud?.tep?.id ?? idTep
            return `Tep: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }

        if (idCedis !== null && idCedis !== undefined && String(idCedis) !== '') {
            const id = String(idCedis)
            const nombre = cedisById.get(id) || solicitud?.nombreCedis || ''
            return `Cedis: ${id}${nombre ? ` - ${nombre}` : ''}`
        }
        if (idPlanta !== null && idPlanta !== undefined && String(idPlanta) !== '') {
            const id = String(idPlanta)
            const nombre = plantasById.get(id) || solicitud?.nombrePlanta || ''
            return `Planta: ${id}${nombre ? ` - ${nombre}` : ''}`
        }
        if (idResu !== null && idResu !== undefined && String(idResu) !== '') {
            const id = String(idResu)
            const nombre = resuById.get(id) || solicitud?.nombreResurreccion || solicitud?.nombreResu || ''
            return `Resu: ${id}${nombre ? ` - ${nombre}` : ''}`
        }
        if (idTep !== null && idTep !== undefined && String(idTep) !== '') {
            const id = String(idTep)
            const nombre = tepById.get(id) || solicitud?.nombreTep || ''
            return `Tep: ${id}${nombre ? ` - ${nombre}` : ''}`
        }

        return solicitud?.centroCostos ?? ''
    }

    const totalPages = useMemo(() => {
        const total = Array.isArray(solicitudes) ? solicitudes.length : 0
        return Math.max(1, Math.ceil(total / pageSize))
    }, [solicitudes])

    const currentPage = Math.min(Math.max(1, page), totalPages)

    const solicitudesPage = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return (solicitudes || []).slice(start, end)
    }, [currentPage, solicitudes])

    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -30%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-0 rounded-0" tabIndex="0">
            <h2>Tabla de solicitudes</h2>
            <div className='row mb-3'>
                <div className="col-sm-2">
                    <BotonSolicitud />
                </div>
                <div className="col-sm-2">
                    <BotonCancelar />
                </div>
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
                            <th scope="col">Destino</th>
                            {/* <th scope="col">Estatus</th> */}
                        </tr>
                    </thead>
                    <tbody className='cuerpoT'>
                        {solicitudesPage.map((solicitud) => {
                            const estatusLabel = getEstatusLabel(solicitud)
                            return (
                                <tr key={solicitud.id}>
                                    <th scope="row">{solicitud?.id}</th>
                                    <td>{getNombreAccesorio(solicitud)}</td>
                                    <td>{getImpresoraLabel(solicitud)}</td>
                                    <td>{solicitud?.cantidad ?? ''}</td>
                                    <td>{formatFecha(solicitud?.fechaSolicitud)}</td>
                                    <td>{getDestinoLabel(solicitud)}</td> 
                                    {/* <td style={getEstatusClass(estatusLabel)}>{estatusLabel}</td> */}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div className="d-flex justify-content-end align-items-center gap-2 pb-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                    >
                        Anterior
                    </button>
                    <div className="small text-muted">
                        Página {currentPage} de {totalPages}
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}
