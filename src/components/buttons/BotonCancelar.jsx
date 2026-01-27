import React from "react";

export default function BotonCancelar({
  type = "button",
  className = "",
  children = "Cancelar",
  ...props
}) {
  return (
    <button type={type} className={`btn btn-outline-danger ${className}`} {...props}>
      {children}
    </button>
  );
}