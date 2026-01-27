import { useState, useEffect } from "react";
import '../style/toners.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import Nav from '../components/navs/navsToner.jsx'

export default function Toners() {

    const [accesorios, setAccesorios] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            cantidad: Number(formData.get("cantidad")),
            entrada: String(formData.get("entrada") || ""),
            nombreAccesorio: String(formData.get("nombreAccesorio") || ""),
            idEstatus: Number(formData.get("idEstatus")),
            idfactura: Number(formData.get("idfactura")),
        };
        setIsSubmitting(true);
        try {
            const res = await fetch("http://127.0.0.1:5000/api/accesorio/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(await res.text());
            alert("Toner creado correctamente");
            e.currentTarget.reset(); // limpia el form
        } catch (err) {
            alert(err?.message || "Error creando toner");
        } finally {
            setIsSubmitting(false);
        }

    }
    return (
        <div className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <Nav />
            <form className="column" onSubmit={handleSubmit}>
                <h2>Agrega toners</h2>
                <div className="form-group">
                    <label>Nombre accesorio</label>
                    <select name="nombreAccesorio" className="form-control" required >
                        <option value="">Seleccione un accesorio</option>
                        {accesorios.map((accesorio) => (
                            <option key={accesorio.id} value={accesorio.nombreAccesorio}>{accesorio.nombreAccesorio}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input name="cantidad" type="number" className="form-control" min="1" required />
                </div>
                <div className="form-group">
                    <label>Entrada</label>
                    <input name="entrada" type="date" className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Id Estatus</label>
                    <input name="idEstatus" type="number" className="form-control" min="1" required />
                </div>
                <div className="form-group">
                    <label>Id Factura</label>
                    <input name="idfactura" type="number" className="form-control" min="1" required />
                </div>
                <div className="button-group">
                    <Boton disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Aceptar"}</Boton>
                    <BotonCancelar type="button" />
                </div>
            </form>
        </div>
    );
}