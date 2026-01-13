import { useState, useEffect } from 'react'
import '../App.css'

export default function Toners() {

    const [toners, setToners] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/accesorio/crear', { method: 'POST' })
            .then(res => {
                if (!res.ok) throw new Error('Error en la solicitud');
                return res.json();
            })
            .then(data => {
                const lista = Array.isArray(data)
                    ? data
                    : (data?.toners ?? data?.toner ?? []);
                setToners(lista);
            })
            .catch(() => setToners([]))
    }, []);

    return ( 
        <div className="row">
            <div className="mb-2">
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
            </div>

        </div>
    );



}