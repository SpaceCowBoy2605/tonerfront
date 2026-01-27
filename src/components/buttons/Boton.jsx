import React, { Children } from "react";

export const Boton = ({ type = "submit", className = "", children = "Aceptar", ...props }) => {
  return (
    <button type={type} className={`btn btn-outline-success ${className}`} {...props}>{children}</button>
  );
}

export default Boton;