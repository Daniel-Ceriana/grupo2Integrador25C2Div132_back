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
import connection from "./src/api/database/db.js";

import bcrypt from "bcrypt";


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

// Creamos el endpoint que recibe los datos que enviamos del <form> del login.ejs
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // Recibimos el email y el password

        if(!email || !password) {
            return res.render("login", {
                title: "login",
                error: "Todos los campos son necesarios!"
            });
        }



        const sql = "SELECT * FROM users where email = ?";
        const [rows] = await connection.query(sql, [email]);


        // Si no recibimos nada, es porque no se encuentra un usuario con ese email o password
        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",
                error: "Error! Email o password no validos"
            });
        }

        console.log(rows);
        const user = rows[0];
        console.table(user);

        // Comparamos el password hasheado 
        const match = await bcrypt.compare(password, user.password);

        console.log(match);

        if(match) {            
            // Guardamos la sesion
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            }
    
            // Una vez guardada la sesion, vamos a redireccionar al dashboard
            res.redirect("/");

        } else {
            return res.render("login", {
                title: "Login",
                error: "Epa! Contraseña incorrecta"
            });
        }


    } catch (error) {
        console.log("Error en el login: ", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
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


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});