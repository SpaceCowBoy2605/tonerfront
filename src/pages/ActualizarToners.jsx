
import { useMemo, useState, useEffect } from "react";
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
    const [cantidadAgregar, setCantidadAgregar] = useState("")

    const UMBRAL_SUFICIENTE = 6;
    const UMBRAL_BAJO = 3;

    const computeEstatusId = (totalCantidad) => {
        const total = Number(totalCantidad);
        if (!Number.isFinite(total)) return "";
        if (total >= UMBRAL_SUFICIENTE) return 1;
        if (total >= UMBRAL_BAJO) return 2;
        return 3;
    };

    const selectedAccesorio = useMemo(() => {
        if (!selectedAccesorioId) return null;
        return (accesorios || []).find((a) => String(a?.id) === String(selectedAccesorioId)) ?? null;
    }, [accesorios, selectedAccesorioId]);

    const cantidadExistente = useMemo(() => {
        const raw = selectedAccesorio?.cantidad;
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
    }, [selectedAccesorio]);

    const cantidadAgregarNumero = useMemo(() => {
        if (cantidadAgregar === "" || cantidadAgregar === null || cantidadAgregar === undefined) return NaN;
        const n = Number(cantidadAgregar);
        return Number.isFinite(n) ? n : NaN;
    }, [cantidadAgregar]);

    const cantidadTotal = useMemo(() => {
        if (!Number.isFinite(cantidadAgregarNumero)) return NaN;
        return cantidadExistente + cantidadAgregarNumero;
    }, [cantidadExistente, cantidadAgregarNumero]);

    const idEstatusAuto = useMemo(() => {
        if (!selectedAccesorioId) return "";
        if (!Number.isFinite(cantidadAgregarNumero)) return "";
        return computeEstatusId(cantidadTotal);
    }, [cantidadAgregarNumero, cantidadTotal, selectedAccesorioId]);

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

        const cantidadAAgregar = Number(formData.get("cantidad"));
        const cantidadTotalSubmit = (Number.isFinite(cantidadAAgregar) ? cantidadAAgregar : 0) + cantidadExistente;
        const idEstatusSubmit = computeEstatusId(cantidadTotalSubmit);

        if (!Number.isFinite(cantidadAAgregar) || cantidadAAgregar <= 0) {
            setErrorMsg("Ingrese una cantidad válida");
            return;
        }

        if (!idEstatusSubmit) {
            setErrorMsg("No se pudo calcular el estatus");
            return;
        }

        const payload = {
            // En este endpoint, el backend suele SUMAR a existencias.
            // Mandamos únicamente la cantidad a agregar para evitar doble suma.
            cantidad: cantidadAAgregar,
            entrada: String(formData.get("entrada") || ""),
            nombreAccesorio,
            // El estatus se calcula con el total esperado (existente + agregar).
            idEstatus: idEstatusSubmit,
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
            const mergedUpdated = updatedFromApi ?? { id: accesorioId, ...payload, cantidad: cantidadTotalSubmit };
            setAccesorios((prev) => prev.map((a) => String(a?.id) === String(accesorioId) ? { ...a, ...mergedUpdated } : a));
            setUltimoCreado(mergedUpdated);

            formEl.reset();
            setSelectedAccesorioId("");
            setCantidadAgregar("");
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
                                        setCantidadAgregar("");
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
                                <label>Cantidad a agregar</label>
                                <input
                                    name="cantidad"
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    required
                                    value={cantidadAgregar}
                                    onChange={(e) => setCantidadAgregar(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de agregado</label>
                                <input name="entrada" type="date" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Estatus (automático)</label>
                                <input
                                    name="idEstatus"
                                    type="number"
                                    className="form-control"
                                    required
                                    readOnly
                                    value={idEstatusAuto}
                                />
                            </div>
                            <div className="button-group">
                                <Boton disabled={isSubmitting}>{isSubmitting ? "Actualizando..." : "Actualizar"}</Boton>
                                <BotonCancelar
                                    onClick={() => {
                                        setErrorMsg("");
                                        setSuccessMsg("");
                                        setUltimoCreado(null);
                                        setSelectedAccesorioId("");
                                        setCantidadAgregar("");
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