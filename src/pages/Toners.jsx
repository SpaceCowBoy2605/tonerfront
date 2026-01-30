import { useState, useEffect, useRef } from "react";
import '../style/toners.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import Nav from '../components/navs/navsToner.jsx'

export default function Toners() {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

    const resolveQrUrl = (qrUrl) => {
        if (!qrUrl) return "";
        if (/^https?:\/\//i.test(qrUrl)) return qrUrl;
        const path = qrUrl.startsWith("/") ? qrUrl : `/${qrUrl}`;
        return `${API_BASE_URL}${path}`;
    };

    const handleDownloadQr = async () => {
                if (!ultimoCreado?.qr_url) return;
                const url = resolveQrUrl(ultimoCreado.qr_url);
                const safeName = String(ultimoCreado.nombreAccesorio || "accesorio")
                        .trim()
                        .replace(/[^a-z0-9-_]+/gi, "_")
                        .slice(0, 60);
                const filename = `qr_${safeName || "accesorio"}.png`;

                try {
                        const resp = await fetch(url);
                        if (!resp.ok) throw new Error("No se pudo descargar el QR");
                        const blob = await resp.blob();
                        const objectUrl = URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = objectUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();

                        URL.revokeObjectURL(objectUrl);
                } catch {
                        // Fallback: abre la imagen en otra pestaña (el usuario puede guardar desde ahí)
                        window.open(url, "_blank", "noopener,noreferrer");
                }
    };

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [accesorios, setAccesorios] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [ultimoCreado, setUltimoCreado] = useState(null)

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

        const payload = {
            cantidad: Number(formData.get("cantidad")),
            entrada: String(formData.get("entrada") || ""),
            nombreAccesorio: String(formData.get("nombreAccesorio") || ""),
            idEstatus: Number(formData.get("idEstatus")),
            idfactura: Number(formData.get("idfactura")),
        };

        setErrorMsg("");
        setSuccessMsg("");
        setUltimoCreado(null);
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/accesorio/crear`, {
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

            const created = (typeof rawBody === "object" && rawBody)
                ? (rawBody?.accesorio ?? rawBody)
                : null;

            setSuccessMsg("Accesorio creado correctamente");
            if (created) {
                setAccesorios((prev) => [created, ...prev]);
                setUltimoCreado(created);
            } else {
                // Si el backend no devuelve el accesorio creado, al menos refrescamos.
                fetch(`${API_BASE_URL}/api/accesorio`)
                    .then(r => r.json())
                    .then(data => {
                        const lista = Array.isArray(data)
                            ? data
                            : (data?.accesorios ?? data?.accesorio ?? []);
                        setAccesorios(lista);

                        // Intentar deducir el recién creado (por id más alto)
                        const lastById = [...lista]
                            .filter((x) => x && (typeof x.id === "number" || typeof x.id === "string"))
                            .sort((a, b) => Number(b.id) - Number(a.id))[0];
                        if (lastById) setUltimoCreado(lastById);
                    })
                    .catch(() => { });
            }

            formEl.reset();
        } catch (err) {
            setErrorMsg(err?.message || "Error creando toner");
        } finally {
            setIsSubmitting(false);
        }
    }

    // limpiar entradas
    const formRef = useRef(null);
    const handleCancel = () => {
        setSuccessMsg("");
        setErrorMsg("");
        setUltimoCreado(null);
        formRef.current?.reset();
    };

    return (
        <div className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <Nav />
            {/* personalizar las notificaciones con bootstrap */}
            {successMsg ? (
                <div className="alert alert-success" role="alert">
                    {successMsg}
                </div>
            ) : null}

            {errorMsg ? (
                <div className="alert alert-danger" role="alert">
                    {errorMsg}
                </div>
            ) : null}
            {/* formulario */}
            <div className="container px-6 mt-4">
                <div className="row gx-15">
                    <div className='col'>
                        <form ref={formRef} className="column" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <h2>Agrega toners</h2>
                                <label>Nombre accesorio</label>
                                <input name="nombreAccesorio" type="text" className="form-control" required/>
                            </div>
                            <div className="form-group">
                                <label>Cantidad</label>
                                <input name="cantidad" type="number" className="form-control" min="1" required />
                            </div>
                            <div className="form-group">
                                <label>Fecha de entrada</label>
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
                                <BotonCancelar type="button" onClick={handleCancel} />
                            </div>
                        </form>
                    </div>
                        {ultimoCreado?.qr_url ? (
                            <div className='col'>
                                <h1>QR</h1>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ fontWeight: 600 }}>{ultimoCreado.nombreAccesorio}</div>
                                    <img
                                        src={resolveQrUrl(ultimoCreado.qr_url)}
                                        alt={`QR de ${ultimoCreado.nombreAccesorio}`}
                                        style={{ width: 180, height: 180, objectFit: "contain" }}
                                        loading="lazy"
                                    />
                                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                        <button type="button" className="btn btn-outline-primary" onClick={handleDownloadQr}>
                                            Descargar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                </div>
            </div>
        </div>
    );
}