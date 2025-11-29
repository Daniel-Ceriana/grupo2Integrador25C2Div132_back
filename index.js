/*===================
    Importaciones
===================*/
import express from "express";
const app = express(); // app es la instancia de la aplicacion Express y contiene todos sus metodos

import environments from "./src/api/config/environments.js"; // Traemos las variables de entorno para extraer el puerto
const PORT = environments.port;

import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones

// Importamos los middlewares
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";

// Importamos las rutas de producto
import { productRoutes } from "./src/api/routes/index.js";

// Importamos la configuracion para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

import session from "express-session";
const SESSION_KEY = environments.session_key;



/*===================
    Middlewares
===================*/
app.use(cors()); // Middleware basico que permite todas las solicitudes
/* Que es CORS?
CORS, o Intercambio de Recursos de Origen Cruzado, es un mecanismo de seguridad implementado por los navegadores web que permite a una página web 
solicitar recursos desde un dominio diferente al del origen actual  Este mecanismo se activa cuando una solicitud HTTP se realiza a un recurso 
en un dominio distinto al de la página que la originó, y su propósito principal es proteger a los usuarios de ataques 
como el secuestro de sesión o el acceso no autorizado a datos sensibles  CORS funciona mediante la verificación de encabezados HTTP específicos, 
como `Access-Control-Allow-Origin`, que el servidor debe incluir en su respuesta para indicar si está autorizado el acceso desde un origen determinado  
Sin este permiso explícito, el navegador bloquea la solicitud para mantener la seguridad de la política del mismo origen*/

/* Middleware para parsear la informacion de JSON a objetos JS en las peticiones POST

El cuerpo de la solicitud, disponible en `req.body`, se utiliza comúnmente para recibir datos enviados en peticiones POST o PUT, aunque requiere middleware como `express.json()` para ser procesado correctamente
*/

// Middleware logger
app.use(loggerUrl);

app.use(express.json()); // Middleware que convierte los datos "application/json" que nos proporciona la cabecera (header) de las solicitudes POST y PUT, los pasa de json a objetos JS

// Middleware para parsear la info de <form>
app.use(express.urlencoded({ extended: true })); // Gracias a este middleware podemos leer la info que nos envia por POST los <form> de HTML (sin fetch y sin JSON)

// Middleware para servir archivos estaticos: construimos la ruta relativa para servir los archivos de la carpeta /public
app.use(express.static(join(__dirname, "src", "public"))); // Gracias a esto podemos servir los archivos de la carpeta public, como http://localhost:3000/img/haring1.png

/*=========================
    Sesiones en Express
===========================
express-session es un middleware que permite que Express recuerde datos entre peticiones
Como hTTP es sin estado (stateless), Express no sabe quienes somos entre una ruta y otra. Por tanto al iniciar sesion, necesitamos guardar algo asi
    req.session.user = {id: 12, name: "Miguel"}

Y luego en cualquier request futura
    if(!req.session.user) {
        return res.redirect("/login");
    }

Sin sesiones no hay forma de saber si el usuario esta logueado, a menos que usemos tokens JWT, cookies firmadas o algun otro sistema

    1. Instalamos express-sesion
        npm i express-session

    2. Creamos la session_key y la guardamos en el .env

    3. Exportamos esta session_key desde environments.js y la traemos al index.js

    4. Hacemos el setup del middleware de sesion en el index.js

    5. Creamos la vista views/login.ejs

    6. Creamos el middleware para parsear los datos que enviamos en el <form> de login
        app.use(express.urlencoded({ extended: true })); 

    7. Creamos el endpoint /login para mostrar la vista login.ejs

    8. Necesitamos crear el endpoint para recibir estos datos que nos manda por POST el <form> de login.ejs

    9. Con los datos correctos que nos devuelva la setencia sql, verificando que existe email y password, guardamos una nueva sesion y redirigimos al dashboard

    11. Creamos el middleware requireLogin para redirigir las vistas del dashboard en caso de que no exista una sesion

    11. Creamos el boton logout

    12. Creamos el endpoint para hacer logout y destruir la sesion


La session_key es una clave privada que Express usa para firmar la cookie de sesion, sirve para evitar que alguien, falsifique, modifique una sesion o robe una identidad

Gracias a esta contraseña (super segura) Express podra crear una cookie segura
Esta contraseña debe ser aleatoria y secreta y guardarse en el .env para que esté segura localmente en nuestra compu
*/

// Middleware de sesion, cada vez que un usuario hace una solicitud HTTP, se gestionara su sesion mediante el middleware
app.use(session({
    secret: SESSION_KEY, // Firma las cookies para evitar manipulacion por el cliente, clave para la seguridad de la aplicaciones, este valor se usa para FIRMAR las cookies de sesion para que el servidor verifique que los datos no fueron alterados por el cliente
    resave: false, // Evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarda sesiones vacias
}));



/*===================
    Configuracion
===================*/
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src", "views")); // Le indicamos la ruta donde estan las vistas ejs




/*===================
Endpoints
===================*/

// Ahora las rutas las gestiona el middleware Router
app.use("/api/products", productRoutes);



// Devolveremos vistas
app.get("/", requireLogin, async (req, res) => {

    /* Logica pasada al middleware requireLogin
    if(!req.session.user) {
        return res.redirect("/login");
    }
    */

    try {
        const [rows] = await connection.query("SELECT * FROM products");
        
        // Le devolvemos la pagina index.ejs
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
})

app.get("/eliminar", requireLogin, (req, res) => {
    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto"
    });
})

// Vista de login
app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Login dashboard"
    });
});


// Endpoint para iniciar sesion
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validacion 1: Evitamos consulta innecesaria
        if(!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Todos los campos son obligatorios"
            });
        }

        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);

        // Validacion 2: Verificamos si existe este email y password
        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Credenciales incorrectas"
            })
        }

        // console.log(rows);
        const user = rows[0];
        console.table(user);

        // Con el email y el password validos, guardamos la sesion
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }

        res.redirect("/"); // Redirigimos a la pagina principal
        

    } catch (error) {
        console.error("Error en el login", error);
    }
});


// Creamos el endpoint para destruir la sesion y redireccionar
app.post("/logout", (req, res) => {

    // 1. Destruimos la sesion
    req.session.destroy((err) => {
        if(err) { // Si existiera algun error destruyendo la sesion
            console.log("Error al destruir la sesion", err);
            return res.status(500).json({
                error: "Error al cerrar la sesion"
            });
        }

        // 2. Redirigimos a login luego de cerrar la sesion
        res.redirect("/login");
    });
});


// TO DO, incorporar vista <form> para crear usuarios y el endpoint para interactuar con esta vista

// TO DO, incorporar bcrypt para hashear las contraseñas https://www.npmjs.com/package/bcrypt


app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`)
});
