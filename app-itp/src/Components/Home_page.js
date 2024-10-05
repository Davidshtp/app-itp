//Se importan los componentes y herramientas que se usaran en este modulo
import { useState, useEffect } from "react";
import avatar from "../assets/images/avatar.png"
import flecha from "../assets/images/flecha.png"
import Axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

export function HomePage(){
    //realizamos los correspondientes manejos de estados 
    const [usuarioslist,setusuarios]=useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const history=useNavigate();
    const location = useLocation();
    

    // Extraer nombre y apellido de la ubicación para poder poner el nombre de la persona que ingreso exitosamente en la parte de arriba del navbar
    const { nombre, apellido } = location.state || {};

    //metodo para realiazr la peticion de poder eliminar un usuario por medio de axios al backend 
    const delete_user=(id)=>{
        Axios.delete("http://localhost:3001/delete/"+id,).then(()=>{
            getusuarios()
        })
    }
    
    //metodo para traer los datos de la base de datos
    const getusuarios =()=>{
        Axios.get("http://localhost:3001/usuarios").then((response)=>{
            setusuarios(response.data);
        }).catch((error)=>{
            console.error("error al obtener la lista de usuarios")
        })
    }

    // Método para abrir el modal de confirmación de eliminación que fue sacado de sweetalert por diseño bacano
    const confirmarEliminacion = (usuario) => {
        MySwal.fire({//propiedades del modal que se mostrara en dado caso para confirmar la eliminacion del usuario
            title: "¿Estás Seguro De Eliminar El Usuario?",
            text: "¡No lo podras revertir!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor:"#d33" ,
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminarlo!",
            customClass:{//clases customizadas para poder poner el titulo mas pequeño dentro del modal
                title:"text-xl"
            }
        }).then((result) => {//se valida si se confirmo 
            if (result.isConfirmed) {
                delete_user(usuario.ID); // Se ejecuta el metodo de eliminacion de usuario pasando el correspondiente ID de usuario a eliminar en la base de datos
                MySwal.fire({//pequeño modal que indica que fue eliminado con exito
                    title: "¡Eliminado!",
                    text: "El usuario ha sido eliminado con exito.",
                    icon: "success"
                });
            }
        });
    };
     // Método para abrir el modal de confirmación de edicion sacado tambien de sweetalert
     const confirmarEdicion = (usuario) => {////propiedades del modal que se mostrara en dado caso para confirmar la edicion del usuario
        MySwal.fire({
            title: "¿Estás Seguro De Editar El Usuario?",
            text: "¡No lo podras revertir!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Editarlo!",
            customClass:{
                title:"text-xl"
            }
        }).then((result) => {//se valida si se confirmo la edicion
            if (result.isConfirmed) {
                update_user(usuarioSeleccionado.ID)//Se ejecuta el metodo para poder editar el usuario con su respectiva id
                MySwal.fire({//modal que indica que fue editado con exito
                    title: "¡Editado!",
                    text: "El usuario ha sido editado con exito.",
                    icon: "success"
                });
            }
            setMostrarModal(false);//se cierra el modal principal de edicion donde se pide los datos que se cambiaran
        });
    };
    //metodo para que recien se renderize la pagina se actualizen los datos
    useEffect(() => {
        getusuarios();
    }, []);
    //metodo para redirigir al inicio
    const inicio=()=>{
        history("/")
    }
    // Método para abrir el modal con los datos del usuario seleccionado
    const abrirModal = (usuario) => {
        setUsuarioSeleccionado(usuario); // Establecer el usuario que se va a editar
        setMostrarModal(true); // Mostrar el modal de edicion 
    };
     // Método para editar o actulizar los datos del usuario en la base de datos
     const update_user = (id) => {
        Axios.put(`http://localhost:3001/update/${id}`,{
            nombre: usuarioSeleccionado?.NOMBRE, //se mandan en la peticion los correspondientes valores por los cuales seran cambiados
            apellido: usuarioSeleccionado?.APELLIDO,
            identificacion: usuarioSeleccionado?.IDENTIFICACION,
            contrasena: usuarioSeleccionado?.CONTRASENA
        })
            .then(() => {
                getusuarios();//actualiza los datos en la pagina para que se puda ver el usuario ya editado
                setMostrarModal(false); // Cerrar modal después de la actualización
            })
            .catch((error) => {//manejo de error
                console.error("error al actualizar el usuario");
            });
    };
    return <>
    <div className="w-full h-[10%] flex bg-gray-500 bg-opacity-25 backdrop-blur-lg">
        <div className="flex items-center space-x-4 ml-[2%]">
            <img src={flecha} alt="flecha" className="h-[40%] cursor-pointer" onClick={inicio}></img>
            <h1 className="font-mono text-xl font-extrabold">Gestion De Horarios De Uso Cancha Sintetica</h1>
        </div>
        <div className="flex space-x-5 items-center ml-auto mr-[5%]">
            <img src={avatar} alt="imagen avatar" className="h-[50%]"></img>
            <h1 className="font-mono font-extrabold">{nombre} {apellido}</h1>
        </div>
    </div>
    <div className="h-[90%] flex items-center justify-center">
        <div className=" bg-slate-100 h-[80%] w-[80%] p-6 overflow-auto">
            <div className="flex justify-center">
                <table className="table-auto w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b-2 border-gray-400">Nombre</th>
                            <th className="px-4 py-2 border-b-2 border-gray-400">Apellido</th>
                            <th className="px-4 py-2 border-b-2 border-gray-400">
                            Número De Identificación
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-400">Contraseña</th>
                            <th className="px-4 py-2 border-b-2 border-gray-400">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        usuarioslist.map((val,key)=>{
                            return <tr className="space-y-3" key={val.ID}>
                                <th className="px-4 py-2 ">{val.NOMBRE}</th>
                                <th className="px-4 py-2 ">{val.APELLIDO}</th>
                                <th className="px-4 py-2 ">{val.IDENTIFICACION}</th>
                                <th className="px-4 py-2 ">{val.CONTRASENA}</th>
                                <th className="px-4 py-2">
                                    <div className="flex space-x-4">
                                        <button className="bg-red-400 p-1 hover:bg-red-600 rounded-lg w-20" onClick={()=>{
                                            confirmarEliminacion(val)
                                        }}>
                                            Eliminar
                                        </button>
                                        <button className="bg-blue-400 p-1 hover:bg-blue-600 rounded-lg w-20" onClick={()=>{
                                            abrirModal(val)
                                        }}>
                                            Editar
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>


        </div>
    </div>
    {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
                        <form onSubmit={(e)=>{
                            e.preventDefault()
                            confirmarEdicion()
                        }}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nombre:</label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado?.NOMBRE || ''}
                                    onChange={(e) =>
                                        setUsuarioSeleccionado({
                                            ...usuarioSeleccionado,
                                            NOMBRE: e.target.value,
                                        })
                                    }
                                    className="border rounded w-full px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Apellido:</label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado?.APELLIDO || ''}
                                    onChange={(e) =>
                                        setUsuarioSeleccionado({
                                            ...usuarioSeleccionado,
                                            APELLIDO: e.target.value,
                                        })
                                    }
                                    className="border rounded w-full px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Número De Identificación:</label>
                                <input
                                    type="text"
                                    value={usuarioSeleccionado?.IDENTIFICACION || ''}
                                    onChange={(e) =>
                                        setUsuarioSeleccionado({
                                            ...usuarioSeleccionado,
                                            IDENTIFICACION: e.target.value,
                                        })
                                    }
                                    className="border rounded w-full px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Contraseña:</label>
                                <input
                                    type="password"
                                    value={usuarioSeleccionado?.CONTRASENA || ''}
                                    onChange={(e) =>
                                        setUsuarioSeleccionado({
                                            ...usuarioSeleccionado,
                                            CONTRASENA: e.target.value,
                                        })
                                    }
                                    className="border rounded w-full px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setMostrarModal(false)} 
                                    className="bg-gray-500 text-white p-2 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() =>confirmarEdicion() } 
                                    className="bg-blue-500 text-white p-2 rounded-lg"
                                >
                                    Editar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}           

    </>

}