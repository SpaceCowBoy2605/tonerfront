import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <div className="App">
      <Header />
      <main className="p-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
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