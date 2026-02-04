import React, { useEffect, useMemo, useState } from "react";
import "../../style/solicitud.css";

export const BotonSolicitud = () => {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

    const [open, setOpen] = useState(false);
    const title = useMemo(() => "Nueva solicitud", []);

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [accesorios, setAccesorios] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedAccesorioId, setSelectedAccesorioId] = useState("");
    const [form, setForm] = useState({
        destinoTipo: "",
        destinoId: "",
        cantidad: 1,
        fechaSolicitud: "",
        impresora: "",
    });

    const handleOpen = () => {
        setSuccessMsg("");
        setErrorMsg("");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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

        const accesorioSeleccionado = accesorios.find((a) => String(a?.id) === String(selectedAccesorioId));
        const destinoIdNum = form.destinoId !== "" ? Number(form.destinoId) : null;

        const payload = {
            // toner / accesorio
            accesorioId: selectedAccesorioId !== "" ? Number(selectedAccesorioId) : null,
            nombreAccesorio: accesorioSeleccionado?.nombreAccesorio ?? "",

            // datos de solicitud
            cantidad: Number(form.cantidad || 0),
            fechaSolicitud: String(form.fechaSolicitud || ""),
            impresora: String(form.impresora || ""),

            // destino (solo uno de estos se llena según destinoTipo)
            idCedis: form.destinoTipo === "cedis" ? destinoIdNum : null,
            idPlanta: form.destinoTipo === "planta" ? destinoIdNum : null,
            idResu: form.destinoTipo === "resu" ? destinoIdNum : null,
            idTep: form.destinoTipo === "tep" ? destinoIdNum : null,
        };

        setErrorMsg("");
        setSuccessMsg("");
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/solicitudes/crear`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const contentType = res.headers.get("content-type") || "";
            const rawBody = contentType.includes("application/json")
                ? await res.json()
                : await res.text();

            if (!res.ok) {
                const msg = typeof rawBody === "string" ? rawBody : (rawBody?.message || "Error creando accesorio");
                throw new Error(msg);
            }

            setSuccessMsg("Solicitud creada correctamente");
            setErrorMsg("");
            setForm({
                destinoTipo: "",
                destinoId: "",
                cantidad: 1,
                fechaSolicitud: "",
                impresora: "",
            });
            setSelectedAccesorioId("");
            setOpen(false);
        } catch (err) {
            setErrorMsg(err?.message || "Error creando toner");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button type="button" className="btn btn-outline-success"
                onClick={handleOpen}>
                Agregar una nueva solicitud</button>

            {open ? (
                <div role="dialog" aria-modal="true" style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "grid",
                    placeItems: "center",
                    zIndex: 2000,
                    padding: 16,
                }}
                    onClick={handleClose}>
                    <div style={{ background: "#fff", borderRadius: 10, maxWidth: 520, width: "100%", padding: 16 }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div style={{ fontWeight: 700 }}>{title}</div>
                            <button type="button" className="btn btn-danger" onClick={handleClose}>
                                X
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ paddingTop: 14 }}>
                            {errorMsg ? (
                                <div className="alert alert-danger" role="alert">{errorMsg}</div>
                            ) : null}
                            {successMsg ? (
                                <div className="alert alert-success" role="alert">{successMsg}</div>
                            ) : null}

                            <div className="mb-3">
                                <label className="form-label">Lugar de destino</label>
                                <select
                                    className="form-select"
                                    name="destinoTipo"
                                    value={form.destinoTipo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona a donde va el toner</option>
                                    <option value="planta">Planta</option>
                                    <option value="resu">Resurrección</option>
                                    <option value="cedis">Cedis</option>
                                    <option value="tep">Teps</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ubicación (ID)</label>
                                <select
                                    className="form-select"
                                    name="destinoTipo"
                                    value={form.destinoTipo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona a donde va el toner</option>
                                    <option value="planta">1</option>
                                    <option value="resu">1</option>
                                    <option value="cedis">1</option>
                                    <option value="tep">1</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Toner</label>
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
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cantidad</label>
                                <input
                                    className="form-control" type="number"
                                    name="cantidad"
                                    value={form.cantidad}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha de solicitud</label>
                                <input
                                    className="form-control" type="date"
                                    name="fechaSolicitud"
                                    value={form.fechaSolicitud}
                                    onChange={handleChange}
                                    placeholder="Ej: Sistemas, Administración..."
                                />
                            </div>


                            <div className="mb-3">
                                <label className="form-label">Impresora</label>
                                <input
                                    className="form-control"
                                    name="impresora"
                                    value={form.impresora}
                                    onChange={handleChange}
                                    placeholder="Impresora"
                                />
                            </div>
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                <button type="button" className="btn btn-outline-danger" onClick={handleClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-outline-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Enviando..." : "Agregar solicitud"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default BotonSolicitud;