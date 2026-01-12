import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Boton from './components/buttons/Boton.jsx'
import Header from './components/header/header.jsx'


function App() {
  const [count, setCount] = useState(0)
  const [accesorios, setAccesorios] = useState([])

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

  return (
    <>
      <Header />
      <div className="tabla container">
        <h2>Tabla de toners </h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Fecha</th>
              <th scope="col">Factura</th>
              <th scope="col">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {accesorios.map((accesorio) => (
              <tr key={accesorio.id}>
                <th scope="row">{accesorio?.id}</th>
                <td>{accesorio?.nombreAccesorio ?? ''}</td>
                <td>{accesorio?.cantidad ?? ''}</td>
                <td>{accesorio?.fecha ?? accesorio?.entrada ?? ''}</td>
                <td>{accesorio?.idfactura ?? ''}</td>
                <td>{accesorio?.idEstatus ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Boton />
      </div>

    </>
  )
}

export default App


{/* <tr>
              {accesorios.map((accesorio) => (
                <th key={accesorio.id}>
                  {accesorio.id}
                </th>
              ))} */}