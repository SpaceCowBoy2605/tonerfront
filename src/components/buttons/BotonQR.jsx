import { useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const resolveQrUrl = (qrUrl) => {
    if (!qrUrl) return "";
    if (/^https?:\/\//i.test(qrUrl)) return qrUrl;
    const path = qrUrl.startsWith("/") ? qrUrl : `/${qrUrl}`;
    return `${API_BASE_URL}${path}`;
};

export const BotonQR = ({ accesorio }) => {
    const [open, setOpen] = useState(false);

    const qrImgUrl = useMemo(() => {
        const direct = accesorio?.qr_url ? resolveQrUrl(accesorio.qr_url) : "";
        if (direct) return direct;
        const id = accesorio?.id;
        if (id === null || id === undefined || id === "") return "";
        return `${API_BASE_URL}/static/accesorio_qrcodes/accesorio_${id}.png`;
    }, [accesorio]);

    const title = `QR - ${accesorio?.nombreAccesorio || "Accesorio"}`;

    const handleOpen = () => {
        if (!qrImgUrl) return;
        setOpen(true);
    };

    const handleDownload = async () => {
        if (!qrImgUrl) return;
        const safeName = String(accesorio?.nombreAccesorio || "accesorio")
            .trim()
            .replace(/[^a-z0-9-_]+/gi, "_")
            .slice(0, 60);
        const filename = `qr_${safeName || "accesorio"}.png`;

        try {
            const resp = await fetch(qrImgUrl);
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
            window.open(qrImgUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-light"
                onClick={handleOpen}
                disabled={!qrImgUrl}
                title={!qrImgUrl ? "Este accesorio no tiene QR disponible" : "Ver QR"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code" viewBox="0 0 16 16">
                    <path d="M2 2h2v2H2z" />
                    <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
                    <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
                    <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
                    <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
                </svg>
                {" "}Ver QR
            </button>

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
                    onClick={() => setOpen(false)}>
                    <div style={{ background: "#fff", borderRadius: 10, maxWidth: 520, width: "100%", padding: 16 }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div style={{ fontWeight: 700 }}>{title}</div>
                            <button type="button" className="btn btn-danger" onClick={() => setOpen(false)}>
                                X
                            </button>
                        </div>
                        <div style={{ display: "grid", placeItems: "center", padding: "14px 0" }}>
                            <img
                                src={qrImgUrl}
                                alt={title}
                                style={{ width: 320, height: 320, objectFit: "contain" }}
                                loading="lazy"
                            />
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button type="button" className="btn btn-outline-primary" onClick={handleDownload}>
                                Descargar
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default BotonQR;