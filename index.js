/*======================
    Importaciones
======================*/
import express from "express"; 
const app = express(); 

import environments from "./src/api/config/environments.js";
const PORT = environments.port;
const session_key = environments.session_key;

import cors from "cors"; 

// Importamos los middlewares
import { loggerUrl } from "./src/api/middlewares/middlewares.js"; 

// Importamos las rutas de producto
import { productRoutes, userRoutes, viewRoutes } from "./src/api/routes/index.js";

// Incorporamos la configuracion en el index.js
import { __dirname, join } from "./src/api/utils/index.js";

import session from "express-session";



/*===================
    Middlewares
====================*/
app.use(cors());

// Middleware para parsear las solicitudes POST y PUT que envian JSON en el body
app.use(express.json());

// Middleware para parsear las solicitudes POST que enviamos desde el <form> HTML
app.use(express.urlencoded({ extended: true }));

app.use(loggerUrl); // Aplicamos el middleware loggerUrl

// Middleware para servir archivos estaticos (img, css, js)
app.use(express.static(join(__dirname, "src/public"))); 



/*================
    Config
================*/
//Configuramos ejs
app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));

// Middleware de sesion 
app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: true
}));



/*======================
    Rutas
======================*/
app.use("/api/products", productRoutes);

app.use("/", viewRoutes);

app.use("/api/users", userRoutes);




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


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});