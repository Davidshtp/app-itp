//llamamos las dependencias necesarias para el funcionamiento del Backend
const express= require("express");
const app= express();
const mysql= require("mysql");
const cors=require("cors");

app.use(cors());
app.use(express.json());
//conexion a base de datos en laragon
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"usuarios_itp"
});
//Endopoint para poder crear nuevos susuarios en la web
app.post("/create",(req,res)=>{
    const nombre= req.body.nombre;
    const apellido=req.body.apellido;
    const identificacion=req.body.identificacion
    const contrasena=req.body.contrasena
    //query para solicitar en la base de datos
    db.query("INSERT INTO users(nombre,apellido,identificacion,contrasena) VALUES(?,?,?,?)",[nombre,apellido,identificacion,contrasena],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Usuario Registrado Con Exito")
            }
        }
    );
});
//Endpoint para poder llevar los usuarios que hay en la base de datos y asi que lleguen al fronted
app.get("/usuarios",(req,res)=>{
    //quuery para seleccionar todos las personas que estan dentro de la base de datos
    db.query("SELECT * FROM users",
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        }
    );
});
//Endpoint para la validacion de el login 
app.post("/login",(req,res)=>{
    const identificacion=req.body.identificacion
    const contrasena=req.body.contrasena
    //query para verificar si se encuentran los datos mandados desde el fronted en la base de datos
    db.query("SELECT * FROM users WHERE identificacion=? AND contrasena=?",[identificacion,contrasena],
        (err,result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error en el servidor"); // Manejo de errores
            }
    
            if (result.length > 0) {
                const usuario = result[0]; // Obtener el primer (y único) resultado
                // Si se encontró al usuario con la identificación y contraseña correctas manda el siguiente json
                return res.status(200).json({
                    message: "Inicio de sesión exitoso",
                    nombre: usuario.NOMBRE,
                    apellido: usuario.APELLIDO
                });
            } else {
                // Si no se encontró ningún usuario que coincida indica error
                return res.status(401).json({
                    message: "credenciales incorrectas",
                });
            } 
        }
    );
});
//Endpoint para verificar si el numero de id que se pasa del fronted esta en la base de datos ya registrado
app.post("/verificacion",(req,res)=>{
    const identificacion=req.body.identificacion
    //query para realizar la validacion de saber si esta o no en la base de datos
    db.query("SELECT * FROM users WHERE identificacion=? ",[identificacion],
        (err,result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error en el servidor"); // Manejo de errores
            }
    
            if (result.length > 0) {
                // Si se encontró un usuario con el mismo id se envia un estado de texto ya existente en la base de datos
                return res.status(409).json({
                    message:"Ya hay un usuario con esta identificacion"
                });
            } else {
                // Si no se encontró ningún usuario que coincida se envia un mensaje con la info correspondiente 
                return res.status(200).json({
                    message: "no hay ningun usuario con el numero de identificacion",
                });
            } 
        }
    );
});
//Endpoint para la eliminacion de usuarios dentro de la base de datoss
app.delete("/delete/:id",(req,res)=>{
    const id=req.params.id
    //query para poder ejecutar la eliminacion de un usuario dentro de la base de datos SE REQUIERE DEL ID UNICO DEL USUARIO
    db.query("DELETE FROM users WHERE id=?",[id],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("empleado eliminado con exito!!");
            }
        }
    );
});
//Endpoint para la actualizacion de datos en la base de datos
app.put("/update/:id",(req,res)=>{
    //obtenemos los datos que queremos editar dentro de un usuario
    const id=req.params.id;
    const nombre= req.body.nombre;
    const apellido=req.body.apellido;
    const identificacion=req.body.identificacion
    const contrasena=req.body.contrasena
    //se realiza el query correspondiente para cambiar los datos de un id especifico dentro de la base de datos
    db.query("UPDATE users SET nombre=?,apellido=?,identificacion=?,contrasena=? WHERE id=?",[nombre,apellido,identificacion,contrasena,id],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Usuario actualizado con exito!!")
            }
        }
    );
});




//Se corre el backend en el puerto deseado en este caso el 3001
app.listen(3001,()=>{
    console.log("corriendo en el puerto 3001")
})