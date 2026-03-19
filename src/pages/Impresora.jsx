import { useMemo, useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import BotonEditar from '../components/buttons/BotonEditar.jsx'
import { Imagenesimpresora } from '../components/imagenes/Imagenes.js'
import NavImpresora from '../components/navs/navsImpresoras.jsx'

export default function Impresoras() {

    const [impresoras, setImpresoras] = useState([])
    const [plantas, setPlantas] = useState([])
    const [resu, setResu] = useState([])
    const [tep, setTep] = useState([])
    const [cedis, setCedis] = useState([])

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

    const getimagenImpresora = (modelo) => {
        const modeloNormalizado = String(modelo ?? '')
            .replace(/"/g, '')
            .trim()
            .toLowerCase()

        if (modeloNormalizado.includes('107') || modeloNormalizado.includes('laserjet 107w')) {
            return Imagenesimpresora.HP107W
        }
        if (modeloNormalizado.includes('5190') || modeloNormalizado.includes('Epson')) {
            return Imagenesimpresora.epson_5190
        }
        if (modeloNormalizado.includes('1120') || modeloNormalizado.includes('Epson')) {
            return Imagenesimpresora.m1120
        }
        if (modeloNormalizado.includes('1606') || modeloNormalizado.includes('Epson')) {
            return Imagenesimpresora.p1606n
        }
        if (modeloNormalizado.includes('111') || modeloNormalizado.includes('HP')) {
            return Imagenesimpresora.HPm111w
        }
        if (modeloNormalizado.includes('1060') || modeloNormalizado.includes('ECOSYS')) {
            return Imagenesimpresora.ECOSYS_1060
        }

        return undefined
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/impresora`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.impresoras ?? data?.impresora ?? []);
                setImpresoras(lista);
            })
            .catch(() => setImpresoras([]))
    }, [API_BASE_URL]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/planta`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data) ? data : (data?.plantas ?? data?.planta ?? [])
                setPlantas(lista)
            })
            .catch(() => setPlantas([]))
    }, [API_BASE_URL])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/resurreccion`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data) ? data : (data?.resurrecciones ?? data?.resurreccion ?? [])
                setResu(lista)
            })
            .catch(() => setResu([]))
    }, [API_BASE_URL])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/tep`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data) ? data : (data?.teps ?? data?.tep ?? [])
                setTep(lista)
            })
            .catch(() => setTep([]))
    }, [API_BASE_URL])

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/cedis`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data) ? data : (data?.cedis ?? data?.cedi ?? [])
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

    const getDestinoLabel = (impresora) => {
        if (!impresora) return ''

        const idCedis = impresora?.idCedis ?? impresora?.cedisId ?? impresora?.id_cedis ?? null
        const idPlanta = impresora?.idPlanta ?? impresora?.plantaId ?? impresora?.id_planta ?? null
        const idResu = impresora?.idResu ?? impresora?.resuId ?? impresora?.id_resu ?? impresora?.idResurreccion ?? impresora?.resurreccionId ?? null
        const idTep = impresora?.idTep ?? impresora?.tepId ?? impresora?.id_tep ?? null

        if (impresora?.cedis?.nombreCedis || impresora?.cedis?.nombre) {
            const nombre = impresora.cedis.nombreCedis ?? impresora.cedis.nombre
            const id = impresora?.cedis?.id ?? idCedis
            return `Cedis: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (impresora?.planta?.nombrePlanta || impresora?.planta?.nombre) {
            const nombre = impresora.planta.nombrePlanta ?? impresora.planta.nombre
            const id = impresora?.planta?.id ?? idPlanta
            return `Planta: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (impresora?.resu?.nombreResurreccion || impresora?.resu?.nombreResu || impresora?.resu?.nombre) {
            const nombre = impresora.resu.nombreResurreccion ?? impresora.resu.nombreResu ?? impresora.resu.nombre
            const id = impresora?.resu?.id ?? idResu
            return `Resu: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (impresora?.resurreccion?.nombreResurreccion || impresora?.resurreccion?.nombreResu || impresora?.resurreccion?.nombre) {
            const nombre = impresora.resurreccion.nombreResurreccion ?? impresora.resurreccion.nombreResu ?? impresora.resurreccion.nombre
            const id = impresora?.resurreccion?.id ?? idResu
            return `Resu: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }
        if (impresora?.tep?.nombreTep || impresora?.tep?.nombre) {
            const nombre = impresora.tep.nombreTep ?? impresora.tep.nombre
            const id = impresora?.tep?.id ?? idTep
            return `Tep: ${id ?? ''}${nombre ? ` - ${nombre}` : ''}`.trim()
        }

        if (idCedis !== null && idCedis !== undefined && String(idCedis) !== '') {
            const id = String(idCedis)
            const nombre = cedisById.get(id) || impresora?.nombreCedis || ''
            return `Cedis: ${id}${nombre ? ` - ${nombre}` : ''}`
        }
        if (idPlanta !== null && idPlanta !== undefined && String(idPlanta) !== '') {
            const id = String(idPlanta)
            const nombre = plantasById.get(id) || impresora?.nombrePlanta || ''
            return `Planta: ${id}${nombre ? ` - ${nombre}` : ''}`
        }
        if (idResu !== null && idResu !== undefined && String(idResu) !== '') {
            const id = String(idResu)
            const nombre = resuById.get(id) || impresora?.nombreResurreccion || impresora?.nombreResu || ''
            return `Resu: ${id}${nombre ? ` - ${nombre}` : ''}`
        }
        if (idTep !== null && idTep !== undefined && String(idTep) !== '') {
            const id = String(idTep)
            const nombre = tepById.get(id) || impresora?.nombreTep || ''
            return `Tep: ${id}${nombre ? ` - ${nombre}` : ''}`
        }

        return ''
    }

    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <div className="row">
                <NavImpresora />
                {impresoras.map((impresora) => (
                    <div key={impresora.id} className="col-sm-6 mb-3 mb-sm-0">
                        <div className="card">
                            <div className="card-body">
                                {getimagenImpresora(impresora?.modelo) ? (
                                    <img src={getimagenImpresora(impresora?.modelo)} alt="Impresora" className="card-img-top" />
                                ) : null}
                                <h5 className="card-title">{impresora.nombreImpresora}</h5>
                                <p className="card-text">{impresora.modelo}</p> 
                                {getDestinoLabel(impresora) ? (
                                    <p className="card-text">{getDestinoLabel(impresora)}</p>
                                ) : null}
                                <BotonEditar />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}