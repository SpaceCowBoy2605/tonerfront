import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Home from './pages/Home'
import About from './pages/About'
import Impresoras from './pages/Impresora.jsx'
import Toners from './pages/Toners.jsx'
import TablaToners from './pages/TablaToners.jsx'
import ActualizarToners from './pages/ActualizarToners.jsx'

function App() {
  return (
    <div className="App">
      <Header />
      <main className="p-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/impresoras" element={<Impresoras />} />
          <Route path="/toners" element={<Toners />} />
          <Route path="/tabla-toners" element={<TablaToners />} />
          <Route path="/actualizar-toners" element={<ActualizarToners />} />
        </Routes>
      </main>
      <About />
    </div>
  )
}

export default App


{/* <tr>
              {accesorios.map((accesorio) => (
                <th key={accesorio.id}>
                  {accesorio.id}
                </th>
              ))} */}