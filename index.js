/*===================
    Importaciones
===================*/
import express from "express";
import session from "express-session";

const app = express(); // app es la instancia de la aplicacion Express y contiene todos sus metodos

import environments from "./src/api/config/environments.js"; // Traemos las variables de entorno para extraer el puerto
const PORT = environments.port;
const session_key =  environments.session_key;
import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones

// Importamos los middlewares
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";

// Importamos las rutas de producto
import { productRoutes } from "./src/api/routes/index.js";

// Importamos la configuracion para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";



/*===================
    Middlewares
===================*/
app.use(cors()); 

// Middleware logger
app.use(loggerUrl);

app.use(express.json()); // Middleware que convierte los datos "application/json" que nos proporciona la cabecera (header) de las solicitudes POST y PUT, los pasa de json a objetos JS

// Middleware para servir archivos estaticos: construimos la ruta relativa para servir los archivos de la carpeta /public
app.use(express.static(join(__dirname, "src", "public"))); // Gracias a esto podemos servir los archivos de la carpeta public, como http://localhost:3000/img/haring1.png

// Middleware para parsear las solicitudes POST que enviamos desde el <form> HTML
app.use(express.urlencoded({ extended: true }));


/*===================
    Configuracion
===================*/
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src", "views")); // Le indicamos la ruta donde estan las vistas ejs

// Middleware de sesion 
app.use(session({
    secret: session_key, // Esto firma las cookies para evitar manipulacion
    resave: false, // Esto evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarde sesiones vacias
}));


/*===================
    Endpoints
===================*/

app.get("/", (req, res) => {
    // Tipo de respuesta texto plano
    res.send("TP Integrador Div 132");
});

/*===================
    Login no modularizado:
===================*/
// TO DO, modularizar
// Creamos el endpoint que recibe los datos que enviamos del <form> del login.ejs

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login"
    });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // Recibimos el email y el password

        // Optimizacion 1: Evitamos consulta innecesaria y le pasamos un mensaje de error a la vista
        if(!email || !password) {
            return res.render("login", {
                title: "login",
                error: "Todos los campos son necesarios!"
            });
        }


        const sql = `SELECT * FROM usuarios where email = ? AND password = ?`;

        const [rows] = await connection.query(sql, [email, password]);

        // Si no recibimos nada, es porque no se encuentra un usuario con ese email o password
        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",
                error: "Error! Email o password no validos"
            });
        }

        console.log(rows); // [ { id: 7, name: 'test', email: 'test@test.com', password: 'test' } ]
        const user = rows[0]; // Guardamos el usuario en la variable user
        console.table(user);

        // Guardamos la sesion
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        // Una vez guardada la sesion, vamos a redireccionar al dashboard
        res.redirect("/index");

    } catch (error) {
        console.log("Error en el login: ", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

/*===================
    Vistas Ejs
===================*/

app.get("/index", requireLogin, async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM productos");
        
        res.render("index", {
            title: "Indice",
            about: "Lista de productos",
            products: rows
        }); 

    } catch (error) {
        console.log(error);
    }
});

app.get("/consultar", requireLogin, (req, res) => {
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id:"
    });
});

app.get("/crear", requireLogin, (req, res) => {
    res.render("crear", {
        title: "Crear",
        about: "Crear producto"
    });
});

app.get("/modificar", requireLogin, (req, res) => {
    res.render("modificar", {
        title: "Modificar",
        about: "Actualizar producto"
    });
});

app.get("/eliminar", requireLogin, (req, res) => {
    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto"
    });
});

// Endpoint para /logout 
app.post("/logout", (req, res) => {
    // Destruimos la sesion
    req.session.destroy((err) => {
        // En caso de existir algun error, mandaremos una respuesta error
        if(err) {
            console.log("Error al destruir la sesion: ", err);

            return res.status(500).json({
                error: "Error al cerrar la sesion"
            });
        }

        res.redirect("/login");
    });
});

/*===================
    Url para la retorno de respuesta de la api, ej. todos los productos en json.
===================*/
app.use("/api/products", productRoutes);





app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`)
});

