
import { useState, useEffect } from "react";
import Nav from '../components/navs/navsToner.jsx'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'

export default function ActualizarToners() {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [accesorios, setAccesorios] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [ultimoCreado, setUltimoCreado] = useState(null)
    const [selectedAccesorioId, setSelectedAccesorioId] = useState("")

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/accesorio`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.accesorios ?? data?.accesorio ?? []);
                setAccesorios(lista);
            })
            .catch(() => setAccesorios([]))
    }, [API_BASE_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formEl = e.currentTarget;

        const formData = new FormData(formEl);

        const accesorioId = String(formData.get("accesorioId") || "");
        const nombreAccesorio = String(formData.get("nombreAccesorio") || "");

        if (!accesorioId) {
            setErrorMsg("Seleccione un accesorio a actualizar");
            return;
        }

        const payload = {
            cantidad: Number(formData.get("cantidad")),
            entrada: String(formData.get("entrada") || ""),
            nombreAccesorio,
            idEstatus: Number(formData.get("idEstatus")),
        };

        setErrorMsg("");
        setSuccessMsg("");
        setUltimoCreado(null);
        setIsSubmitting(true);


        try {
            const res = await fetch(`${API_BASE_URL}/api/accesorio/actualizar/${encodeURIComponent(accesorioId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const contentType = res.headers.get("content-type") || "";
            const rawBody = contentType.includes("application/json")
                ? await res.json()
                : await res.text();

            if (!res.ok) {
                const msg = typeof rawBody === "string" ? rawBody : (rawBody?.message || "Error actualizando accesorio");
                throw new Error(msg);
            }

            const updatedFromApi = (typeof rawBody === "object" && rawBody)
                ? (rawBody?.accesorio ?? rawBody)
                : null;

            setSuccessMsg("Accesorio actualizado correctamente");
            const mergedUpdated = updatedFromApi ?? { id: accesorioId, ...payload };
            setAccesorios((prev) => prev.map((a) => String(a?.id) === String(accesorioId) ? { ...a, ...mergedUpdated } : a));
            setUltimoCreado(mergedUpdated);

            formEl.reset();
            setSelectedAccesorioId("");
        } catch (err) {
            setErrorMsg(err?.message || "Error actualizando toner");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <Nav />
            <div className="container px-6 mt-4">
                <div className="row gx-15">
                    <div className='col'>
                        <h2>Actualizar Toners</h2>
                        <form onSubmit={handleSubmit}>
                            {errorMsg ? <div className="alert alert-danger" role="alert">{errorMsg}</div> : null}
                            {successMsg ? <div className="alert alert-success" role="alert">{successMsg}</div> : null}
                            <div className="form-group">
                                <h2>Actualiza tus toners existentes</h2>
                                <label>Nombre accesorio</label>
                                <select
                                    name="accesorioId"
                                    className="form-control"
                                    required
                                    value={selectedAccesorioId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setSelectedAccesorioId(id);
                                    }}
                                >
                                    <option value="">Seleccione un accesorio</option>
                                    {accesorios.map((accesorio) => (
                                        <option key={accesorio.id} value={String(accesorio.id)}>{accesorio.nombreAccesorio}</option>
                                    ))}
                                </select>
                                {/* Enviamos también el nombre (como pide tu ejemplo del backend) */}
                                <input
                                    type="hidden"
                                    name="nombreAccesorio"
                                    value={selectedAccesorioId ? (accesorios.find((a) => String(a?.id) === String(selectedAccesorioId))?.nombreAccesorio ?? "") : ""}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Cantidad</label>
                                <input name="cantidad" type="number" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Fecha de agregado</label>
                                <input name="entrada" type="date" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Estatus</label>
                                <input name="idEstatus" type="number" className="form-control" required />
                            </div>
                            <div className="button-group">
                                <Boton disabled={isSubmitting}>{isSubmitting ? "Actualizando..." : "Actualizar"}</Boton>
                                <BotonCancelar
                                    onClick={() => {
                                        setErrorMsg("");
                                        setSuccessMsg("");
                                        setUltimoCreado(null);
                                        setSelectedAccesorioId("");
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}