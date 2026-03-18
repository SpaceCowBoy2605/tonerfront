import React, { useEffect, useMemo, useState } from "react";
import "../../style/solicitud.css";

export const BotonSolicitud = () => {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

    const [open, setOpen] = useState(false);
    const title = useMemo(() => "Nueva solicitud", []);

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [accesorios, setAccesorios] = useState([])
    const [plantas, setPlantas] = useState([])
    const [resu, setResu] = useState([])
    const [tep, setTep] = useState([])
    const [cedis, setCedis] = useState([])
    const [impresoras, setImpresoras] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedAccesorioId, setSelectedAccesorioId] = useState("");
    const [selectedPlantaId, setSelectedPlantaId] = useState("");
    const [selectedResuId, setSelectedResuId] = useState("");
    const [selectedTepId, setSelectedTepId] = useState("");
    const [selectedCedisId, setSelectedCedisId] = useState("");
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
        // Si cambia el tipo de destino, limpiamos el id seleccionado para evitar inconsistencias.
        if (name === "destinoTipo") {
            setForm((prev) => ({ ...prev, destinoTipo: value, destinoId: "" }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const destinoOptions = useMemo(() => {
        switch (form.destinoTipo) {
            case "planta":
                return (plantas || [])
                    .map((p) => ({ id: p?.id, label: p?.nombrePlanta ?? p?.nombre ?? "" }))
                    .filter((opt) => opt.id !== undefined && opt.id !== null);
            case "resu":
                return (resu || [])
                    .map((r) => ({
                        id: r?.id,
                        label: r?.nombreResurreccion ?? r?.nombreResu ?? r?.nombre ?? "",
                    }))
                    .filter((opt) => opt.id !== undefined && opt.id !== null);
            case "cedis":
                return (cedis || [])
                    .map((c) => ({ id: c?.id, label: c?.nombreCedis ?? c?.nombre ?? "" }))
                    .filter((opt) => opt.id !== undefined && opt.id !== null);
            case "tep":
                return (tep || [])
                    .map((t) => ({ id: t?.id, label: t?.nombreTep ?? t?.nombre ?? "" }))
                    .filter((opt) => opt.id !== undefined && opt.id !== null);
            default:
                return [];
        }
    }, [cedis, form.destinoTipo, plantas, resu, tep]);

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

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/planta`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.plantas ?? data?.planta ?? []);
                setPlantas(lista);
            })
            .catch(() => setPlantas([]))
    }, [API_BASE_URL]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/resurreccion`)
            .then(resus => resus.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.resurrecciones ?? data?.resurreccion ?? []);
                setResu(lista);
            })
            .catch(() => setResu([]))
    }, [API_BASE_URL]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/tep`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.teps ?? data?.tep ?? []);
                setTep(lista);
            })
            .catch(() => setTep([]))
    }, [API_BASE_URL]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/cedis`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.cedis ?? data?.cedi ?? []);
                setCedis(lista);
            })
            .catch(() => setCedis([]))
    }, [API_BASE_URL]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/impresora`)
            .then(res => res.json())
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.impresoras ?? data?.impresora ?? [])
                setImpresoras(lista)
            })
            .catch(() => setImpresoras([]))
    }, [API_BASE_URL])

    const impresoraOptions = useMemo(() => {
        return (impresoras || [])
            .map((i) => {
                const id = i?.id ?? i?.idImpresora ?? i?.impresoraId
                const nombre = i?.nombreImpresora ?? i?.nombre ?? i?.marca ?? ""
                const modelo = i?.modelo ?? i?.modeloImpresora ?? i?.model ?? ""
                const label = [nombre, modelo].filter(Boolean).join(" ").trim()
                return {
                    id,
                    label,
                }
            })
            .filter((opt) => opt.id !== undefined && opt.id !== null)
    }, [impresoras])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const toErrorMessage = (rawBody) => {
            if (!rawBody) return "Error desconocido";
            if (typeof rawBody === "string") return rawBody;
            return (
                rawBody?.message ||
                rawBody?.error ||
                rawBody?.detail ||
                rawBody?.msg ||
                (rawBody?.errors ? JSON.stringify(rawBody.errors) : "") ||
                JSON.stringify(rawBody)
            );
        };

        const accesorioSeleccionado = accesorios.find((a) => String(a?.id) === String(selectedAccesorioId));
        const plantaSeleccionada = plantas.find((p) => String(p?.id) === String(selectedPlantaId));
        const tepSeleccionado = tep.find((t) => String(t?.id) === String(selectedTepId));
        const resuSeleccionada = resu.find((r) => String(r?.id) === String(selectedResuId));
        const destinoIdNum = form.destinoId !== "" ? Number(form.destinoId) : null;

        const accesorioIdNum = selectedAccesorioId !== "" ? Number(selectedAccesorioId) : null;
        const cantidadNum = Number(form.cantidad || 0);
        const impresoraIdNum = String(form.impresora || "").trim() !== "" ? Number(form.impresora) : null;

        if (!accesorioIdNum) {
            setErrorMsg("Selecciona un accesorio");
            return;
        }

        if (!Number.isFinite(cantidadNum) || cantidadNum < 1) {
            setErrorMsg("La cantidad debe ser mayor a 0");
            return;
        }
        

        const payload = {
            // toner / accesorio
            // Compatibilidad backend: requiere idAccesorio (o idAcc)
            idAccesorio: accesorioIdNum,
            idAcc: accesorioIdNum,
            // Mantener este campo por si otros endpoints lo usan
            accesorioId: accesorioIdNum,
            plantaId: selectedPlantaId !== "" ? Number(selectedPlantaId) : null,
            resuId: selectedResuId !== "" ? Number(selectedResuId) : null,
            tepId: selectedTepId !== "" ? Number(selectedTepId) : null,

            nombreAccesorio: accesorioSeleccionado?.nombreAccesorio ?? "",
            nombrePlanta: plantaSeleccionada?.nombrePlanta ?? "",
            // Soportar ambas variantes de nombre para evitar que llegue vacío por diferencia de API.
            nombreResu: resuSeleccionada?.nombreResu ?? resuSeleccionada?.nombreResurreccion ?? "",
            nombreResurreccion: resuSeleccionada?.nombreResurreccion ?? resuSeleccionada?.nombreResu ?? "",
            nombreTep: tepSeleccionado?.nombreTep ?? "",

            // datos de solicitud
            // Compatibilidad backend: acepta cantidad y/o cantidadSolicitada
            cantidad: cantidadNum,
            cantidadSolicitada: cantidadNum,
            fechaSolicitud: String(form.fechaSolicitud || ""),
            // Impresora como ID numérico (evitar que llegue como string)
            impresora: impresoraIdNum,
            idImpresora: impresoraIdNum,
            impresoraId: impresoraIdNum,

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
            console.groupCollapsed("[Solicitud] Enviando payload");
            console.log(payload);
            console.groupEnd();

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
                const msg = toErrorMessage(rawBody) || "Solicitud inválida";
                console.groupCollapsed(`[Solicitud] Error ${res.status} ${res.statusText}`);
                console.log("Respuesta:", rawBody);
                console.log("Payload:", payload);
                console.groupEnd();
                throw new Error(`(${res.status}) ${msg}`);
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
            setSelectedPlantaId("");
            setSelectedResuId("");
            setSelectedTepId("");
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

            {successMsg ? (
                <div className="alert alert-success mt-3 d-flex justify-content-between align-items-center" role="alert">
                    <div>{successMsg}</div>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Cerrar"
                        onClick={() => setSuccessMsg("")}
                    />
                </div>
            ) : null}

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
                                    name="destinoId"
                                    value={form.destinoId}
                                    onChange={handleChange}
                                    required
                                    disabled={!form.destinoTipo}
                                >
                                    <option value="">Seleccione una ubicación</option>
                                    {destinoOptions.map((opt) => (
                                        <option key={String(opt.id)} value={String(opt.id)}>
                                            {String(opt.id)}{opt.label ? ` - ${opt.label}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
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
                                <select
                                    className="form-select"
                                    name="impresora"
                                    value={form.impresora}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione una impresora (opcional)</option>
                                    {impresoraOptions.map((opt) => (
                                        <option key={String(opt.id)} value={String(opt.id)}>
                                            {String(opt.id)}{opt.label ? ` - ${opt.label}` : ""}
                                        </option>
                                    ))}
                                </select>
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


