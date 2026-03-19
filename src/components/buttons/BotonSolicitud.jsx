import React, { useEffect, useMemo, useState } from "react";
import "../../style/solicitud.css";

const getTodayISODate = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const getImpresoraDestinoId = (impresora, destinoTipo) => {
    if (!impresora || !destinoTipo) return null;

    const pick = (...vals) => {
        for (const v of vals) {
            if (v !== undefined && v !== null && String(v) !== "") return v;
        }
        return null;
    };

    switch (destinoTipo) {
        case "planta":
            return pick(
                impresora?.idPlanta,
                impresora?.plantaId,
                impresora?.id_planta,
                impresora?.planta?.id,
            );
        case "resu":
            return pick(
                impresora?.idResu,
                impresora?.resuId,
                impresora?.id_resu,
                impresora?.idResurreccion,
                impresora?.resurreccionId,
                impresora?.resu?.id,
                impresora?.resurreccion?.id,
            );
        case "cedis":
            return pick(
                impresora?.idCedis,
                impresora?.cedisId,
                impresora?.id_cedis,
                impresora?.cedis?.id,
            );
        case "tep":
            return pick(
                impresora?.idTep,
                impresora?.tepId,
                impresora?.id_tep,
                impresora?.tep?.id,
            );
        default:
            return null;
    }
};

const getImpresoraId = (impresora) => {
    return impresora?.id ?? impresora?.idImpresora ?? impresora?.impresoraId ?? null;
};

const getImpresoraAccesorioIds = (impresora) => {
    if (!impresora) return [];

    const ids = new Set();
    const push = (v) => {
        if (v === undefined || v === null) return;
        const s = String(v).trim();
        if (!s) return;
        ids.add(s);
    };

    // Variantes comunes: directo o anidado
    push(impresora?.idAccesorio);
    push(impresora?.accesorioId);
    push(impresora?.idAcc);
    push(impresora?.idToner);
    push(impresora?.tonerId);
    push(impresora?.accesorio?.id);
    push(impresora?.toner?.id);

    // Si viene como arreglo
    const arr =
        impresora?.accesorios ||
        impresora?.toners ||
        impresora?.accesorioIds ||
        impresora?.tonerIds ||
        [];
    if (Array.isArray(arr)) {
        arr.forEach((item) => push(item?.id ?? item?.accesorioId ?? item?.idAccesorio ?? item));
    }

    return Array.from(ids);
};

const getAccesorioId = (accesorio) => {
    return accesorio?.id ?? accesorio?.idAccesorio ?? accesorio?.accesorioId ?? null;
};

const getAccesorioImpresoraIds = (accesorio) => {
    if (!accesorio) return [];

    const ids = new Set();
    const push = (v) => {
        if (v === undefined || v === null) return;
        const s = String(v).trim();
        if (!s) return;
        ids.add(s);
    };

    // Variantes comunes: el accesorio apunta a una impresora
    push(accesorio?.idImpresora);
    push(accesorio?.impresoraId);
    push(accesorio?.id_impresora);
    push(accesorio?.impresora?.id);

    // O viene como lista de impresoras compatibles
    const arr =
        accesorio?.impresoras ||
        accesorio?.impresorasCompatibles ||
        accesorio?.compatibles ||
        accesorio?.impresoraIds ||
        [];
    if (Array.isArray(arr)) {
        arr.forEach((item) => push(item?.id ?? item?.idImpresora ?? item?.impresoraId ?? item));
    }

    return Array.from(ids);
};

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
        fechaSolicitud: getTodayISODate(),
        impresora: "",
    });

    const handleOpen = () => {
        setSuccessMsg("");
        setErrorMsg("");
        setSelectedAccesorioId("");
        setForm({
            destinoTipo: "",
            destinoId: "",
            cantidad: 1,
            fechaSolicitud: getTodayISODate(),
            impresora: "",
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si cambia el tipo de destino, limpiamos el id seleccionado para evitar inconsistencias.
        if (name === "destinoTipo") {
            setSelectedAccesorioId("");
            setForm((prev) => ({ ...prev, destinoTipo: value, destinoId: "", impresora: "" }));
            return;
        }
        // Si cambia la ubicación, limpiamos impresora para que no quede una de otro destino.
        if (name === "destinoId") {
            setSelectedAccesorioId("");
            setForm((prev) => ({ ...prev, destinoId: value, impresora: "" }));
            return;
        }
        if (name === "impresora") {
            // Al cambiar impresora, se debe re-elegir toner/accesorio compatible.
            setSelectedAccesorioId("");
            setForm((prev) => ({ ...prev, impresora: value }));
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

    const impresorasFiltradas = useMemo(() => {
        const destinoTipo = form.destinoTipo;
        const destinoId = form.destinoId;

        if (!destinoTipo || !destinoId) return impresoras || [];

        const destinoIdStr = String(destinoId);
        return (impresoras || []).filter((impresora) => {
            const id = getImpresoraDestinoId(impresora, destinoTipo);
            return id !== null && String(id) === destinoIdStr;
        });
    }, [form.destinoId, form.destinoTipo, impresoras]);

    const impresoraSeleccionada = useMemo(() => {
        if (!form.impresora) return null;
        const selectedId = String(form.impresora);
        return (impresorasFiltradas || []).find((i) => {
            const id = getImpresoraId(i);
            return id !== null && String(id) === selectedId;
        }) ?? null;
    }, [form.impresora, impresorasFiltradas]);

    const accesoriosFiltrados = useMemo(() => {
        if (!form.impresora) return accesorios || [];

        const impresoraIdStr = String(form.impresora);
        const idsPorImpresora = getImpresoraAccesorioIds(impresoraSeleccionada);

        // 1) Preferir relación impresora -> accesorio (más común cuando la impresora tiene “su” toner)
        if (idsPorImpresora.length > 0) {
            const allowed = new Set(idsPorImpresora);
            return (accesorios || []).filter((a) => {
                const id = getAccesorioId(a);
                return id !== null && allowed.has(String(id));
            });
        }

        // 2) Fallback: accesorio -> impresora (cuando el accesorio define sus impresoras compatibles)
        const filtrados = (accesorios || []).filter((a) => {
            const ids = getAccesorioImpresoraIds(a);
            return ids.includes(impresoraIdStr);
        });

        // Si no hay forma de relacionar (ningún accesorio trae info), no bloqueamos al usuario.
        const hayRelacionEnAlguno = (accesorios || []).some((a) => getAccesorioImpresoraIds(a).length > 0);
        if (!hayRelacionEnAlguno) return accesorios || [];

        return filtrados;
    }, [accesorios, form.impresora, impresoraSeleccionada]);

    useEffect(() => {
        if (!selectedAccesorioId) return;
        const selectedId = String(selectedAccesorioId);
        const exists = (accesoriosFiltrados || []).some((a) => {
            const id = getAccesorioId(a);
            return id !== null && String(id) === selectedId;
        });
        if (!exists) {
            setSelectedAccesorioId("");
        }
    }, [accesoriosFiltrados, selectedAccesorioId]);

    useEffect(() => {
        if (!form.impresora) return;
        const selectedId = String(form.impresora);
        const exists = (impresorasFiltradas || []).some((i) => {
            const id = i?.id ?? i?.idImpresora ?? i?.impresoraId;
            return id !== undefined && id !== null && String(id) === selectedId;
        });
        if (!exists) {
            setForm((prev) => ({ ...prev, impresora: "" }));
        }
    }, [form.impresora, impresorasFiltradas]);

    const impresoraOptions = useMemo(() => {
        return (impresorasFiltradas || [])
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
    }, [impresorasFiltradas])

    useEffect(() => {
        // Autollenado: si destino+ubicación dejan solo 1 impresora, selecciónala.
        if (!form.destinoTipo || !form.destinoId) return;
        if (form.impresora) return;
        if (!Array.isArray(impresoraOptions)) return;
        if (impresoraOptions.length !== 1) return;

        const only = impresoraOptions[0];
        if (only?.id === undefined || only?.id === null) return;
        setForm((prev) => ({ ...prev, impresora: String(only.id) }));
    }, [form.destinoId, form.destinoTipo, form.impresora, impresoraOptions]);

    useEffect(() => {
        // Autollenado: si una impresora deja solo 1 accesorio/toner compatible, selecciónalo.
        if (!form.impresora) return;
        if (selectedAccesorioId) return;
        if (!Array.isArray(accesoriosFiltrados)) return;
        if (accesoriosFiltrados.length !== 1) return;

        const only = accesoriosFiltrados[0];
        const onlyId = getAccesorioId(only);
        if (onlyId === null) return;
        setSelectedAccesorioId(String(onlyId));
    }, [accesoriosFiltrados, form.impresora, selectedAccesorioId]);

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
                fechaSolicitud: getTodayISODate(),
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
                                    {accesoriosFiltrados.map((accesorio) => (
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


