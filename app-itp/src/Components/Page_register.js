//Se importan los componentes y herramientas que se usaran en este modulo
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";


export function PageRegister(){
    //realizamos los correspondientes manejos de estados 
    const [nombre, setNombre] = useState("");
    const [apellido,setApellido]=useState("");
    const [Identificacion,setIdentificacion]=useState("");
    const [contrasena,setContrasena]=useState("");
    const [mensaje,setMensaje]=useState("")
    //se usa para manejo de rutas
    const history= useNavigate();

    //evento para redireccionar a pagina de inicio de sesion
    const Inicio_Sesion=()=>{
     history("/")
    }

    // Envío de datos a la base de datos
    const envio = (e) => {
        e.preventDefault();
    
        // Verificamos si todos los campos están llenos
        if (!nombre || !apellido || !Identificacion || !contrasena) {
            setMensaje("Ingrese todos los datos");
            return;
        }
        //verificamos que el campo de identificacion sea un numero si o si
        if (isNaN(Identificacion)) {
            setMensaje("El número de identificación debe ser un número");
            return;
        }
    
        // Verificamos si el usuario ya está registrado
        Axios.post("http://localhost:3001/verificacion", {//se hace la peticion al backend para saber si el numero de id ya existe o no
            identificacion: Identificacion
        }).then((verificacionResponse) => {
            // Manejamos la respuesta de verificación
            if (verificacionResponse.status===409) {//si el id se encuentra en la base de datos se procede a dejar un mensaje y no se ejecuta la peticion de agregar nuevo usuario
                setMensaje(verificacionResponse.data.message); // Mensaje de usuario ya registrado
            } else {
                // Procedemos a crear el nuevo usuario
                Axios.post("http://localhost:3001/create", {
                    nombre: nombre,
                    apellido: apellido,
                    identificacion: Identificacion,
                    contrasena: contrasena
                }).then(() => {
                    //se limpian los campos del forumlario de registro una vez ya registrado el usuario
                    setNombre("");
                    setApellido("");
                    setIdentificacion("");
                    setContrasena("");
                    setMensaje("El registro ha sido exitoso");//mensaje de exito de registro
                    setTimeout(() => {//pasados 1,4 segundos redirige a la pagina de inicio de sesion
                        history("/"); 
                    }, 1400);
                }).catch((error) => {//toma de errores al registrar el usuario
                    setMensaje("Hubo un error al registrar el usuario");
                    console.log(error);
                });
            }
        }).catch((error) => {//toma de errores al verificar si la id existe en la base de datos o no
            if (error.response) {
                setMensaje(error.response.data.message || "Error desconocido");
            } else {
                setMensaje("Error al verificar la identificación");
                console.log("Error sin respuesta:", error);
            }
        });
    };


    return<div className="flex  justify-center items-center h-[100%]">
        <div className="w-[30%] h-[60%] rounded-xl flex items-center justify-center  bg-gray-500 bg-opacity-25 backdrop-blur-lg">
            <h1 className="absolute right-5 top-5 text-xl cursor-pointer" onClick={Inicio_Sesion}>X</h1>
            <form onSubmit={envio}>
                <div className="flex flex-col space-y-4">
                    <h1 className="flex justify-center font-mono pb-8 text-xl">Registro De Usuarios</h1>
                    <div className="flex items-center justify-center mobile-sm:space-x-3">
                        <div className="text-right font-semibold font-mono mobile-sm:text-xxs mobile-sm:w-[40%] mobile-md:text-xs laptop-md:text-sm">Nombre</div>
                        <input className="rounded-xl focus:outline-none border-gray-300 border-2 placeholder:text-center   mobile-sm:placeholder:text-xxxs mobile-sm:p-1 mobile-sm:w-[75%] mobile-md:placeholder:text-xxs laptop-md:placeholder:text-xs px-4 " 
                        placeholder="Ingrese Su Nombre " 
                        onChange={(e)=>setNombre(e.target.value)}
                        value={nombre}
                        ></input>
                    </div>
                    <div className="flex items-center justify-center mobile-sm:space-x-3">
                        <div className="text-right font-semibold font-mono mobile-sm:text-xxs mobile-sm:w-[40%] mobile-md:text-xs laptop-md:text-sm">Apellido</div>
                        <input className="rounded-xl focus:outline-none border-gray-300 border-2 placeholder:text-center   mobile-sm:placeholder:text-xxxs mobile-sm:p-1 mobile-sm:w-[75%] mobile-md:placeholder:text-xxs laptop-md:placeholder:text-xs px-4 " 
                        placeholder="Ingrese Su Apellido"
                        onChange={(e)=>{setApellido(e.target.value)}}
                        value={apellido}
                        ></input>
                    </div>
                    <div className="flex items-center justify-center mobile-sm:space-x-3">
                        <div className="text-right font-semibold font-mono mobile-sm:text-xxs mobile-sm:w-[40%] mobile-md:text-xs laptop-md:text-sm">Numero De Identificacion</div>
                        <input className="rounded-xl focus:outline-none border-gray-300 border-2 placeholder:text-center   mobile-sm:placeholder:text-xxxs mobile-sm:p-1 mobile-sm:w-[75%] mobile-md:placeholder:text-xxs laptop-md:placeholder:text-xs px-4 " 
                        placeholder="Ingrese Su Numero De Documento "
                        onChange={(e)=>{setIdentificacion(e.target.value)}}
                        value={Identificacion}
                        title="Este campo debe ser un número"
                        ></input>
                    </div>
                    <div className="flex items-center justify-center mobile-sm:space-x-3">
                        <div className="text-right font-semibold font-mono mobile-sm:text-xxs mobile-sm:w-[40%] mobile-md:text-xs laptop-md:text-sm">Contraseña</div>
                        <input className="rounded-xl focus:outline-none border-gray-300 border-2 placeholder:text-center   mobile-sm:placeholder:text-xxxs mobile-sm:p-1 mobile-sm:w-[75%] mobile-md:placeholder:text-xxs laptop-md:placeholder:text-xs px-4 " 
                        placeholder="Ingrese Una Contraseña "
                        onChange={(e)=>{setContrasena(e.target.value)}}
                        value={contrasena}
                        type="password"
                        ></input>
                    </div>
                   <button className="bg-green-800  rounded-lg  text-white font-mono mobile-sm:text-xxs mobile-sm:p-1 mobile-md:text-xs laptop-md:text-sm hover:bg-green-900">Enviar</button>
                   {mensaje&&(
                        <p className={`text-center mt-4 text-sm ${mensaje.includes("exitoso") ? "text-green-600" : "text-red-600"}`}>
                        {mensaje}
                        </p>
                   )}
                </div>
            </form>
        </div>
    </div>
}