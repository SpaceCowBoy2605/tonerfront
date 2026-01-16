import { useState, useEffect } from 'react'
import '../App.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import BotonEditar from '../components/buttons/BotonEditar.jsx'
import { Imagenesimpresora } from '../components/imagenes/Imagenes.js'

export default function Impresoras() {

    const [impresoras, setImpresoras] = useState([])

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

        return undefined
    }

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
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <div className="row">
                {impresoras.map((impresora) => (
                    <div key={impresora.id} className="col-sm-6 mb-3 mb-sm-0">
                        <div className="card">
                            <div className="card-body">
                                {getimagenImpresora(impresora?.modelo) ? (
                                    <img src={getimagenImpresora(impresora?.modelo)} alt="Impresora" className="card-img-top" />
                                ) : null}
                                <h5 className="card-title">{impresora.nombreImpresora}</h5>
                                <p className="card-text">{impresora.modelo}</p>
                                <BotonEditar />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}