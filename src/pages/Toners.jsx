import { Link } from 'react-router-dom'
import '../style/toners.css'
import Boton from '../components/buttons/Boton.jsx'
import BotonCancelar from '../components/buttons/BotonCancelar.jsx'
import Nav from '../components/navs/navsToner.jsx'

export default function Toners() {

    // const [toners, setToners] = useState([])

    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/api/accesorio/crear', { method: 'POST' })
    //         .then(res => {
    //             if (!res.ok) throw new Error('Error en la solicitud');
    //             return res.json();
    //         })
    //         .then(data => {
    //             const lista = Array.isArray(data)
    //                 ? data
    //                 : (data?.toners ?? data?.toner ?? []);
    //             setToners(lista);
    //         })
    //         .catch(() => setToners([]))
    // }, []);

    return (
        <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example bg-body-tertiary p-3 rounded-2" tabIndex="0">
            <Nav />
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <form className="column">
                        <h2>Agrega toners </h2>
                        <div className="form-group">
                            <label >Accesorio</label>
                            <div className="input-group mb-10">
                                {/* <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                        </div> */}
                                <select class="custom-select" id="inputGroupSelect01">
                                    <option selected>Choose...</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label >Cantidad</label>
                            <input type="number" className="form-control" placeholder="Cantidad" />
                        </div>
                        <div className="form-group">
                            <label >Fecha</label>
                            <input type="date" className="form-control" />
                        </div>
                        <div className="button-group">
                            <Boton />
                            <BotonCancelar />
                        </div>
                    </form>
                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
            </div>

        </div>
    );



}