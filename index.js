/*======================
    Importaciones
======================*/
import express from "express"; 
const app = express(); 

import environments from "./src/api/config/environments.js";
const PORT = environments.port;
const session_key = environments.session_key;

// Importamos los middlewares
import { loggerUrl } from "./src/api/middlewares/middlewares.js"; 

// Importamos las rutas de producto
import { productRoutes, userRoutes, viewRoutes } from "./src/api/routes/index.js";

// Incorporamos la configuracion en el index.js
import { __dirname, join } from "./src/api/utils/index.js";

import session from "express-session";



/*===================
    Configuracion de cors
====================*/
import cors from "cors";

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5501",
    "http://localhost:3000",
    "http://localhost:5173"
];


app.use(cors({
    origin: function(origin, callback) {
        // permitir solicitudes sin origen (como POST desde Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Origen no permitido por CORS"));
        }
    },
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true 
}));

/*===================
    Middlewares
====================*/
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

import connection from "./src/api/database/db.js";

app.post("/api/sales", async (req, res) => {
    try {
        // Recibimos los datos del cuerpo de la peticion HTTP
        let { total_price, user_name, products, arrayProductos } = req.body;

        // Validacion de datos obligatorios
        if(!total_price || !user_name || !Array.isArray(products) || !Array.isArray(arrayProductos)) {
            return res.status(400).json({
                message: "Datos invalidos, debes total_price, user_name, products (array), arrayProductos (array)"
            });
        }

        // 1. Insertar la venta en la tabla "sales"
        const sqlSale = "INSERT INTO ventas (nombre_usuario, total) VALUES (?, ?)";
        const [saleResult] = await connection.query(sqlSale, [user_name, total_price]);

        // 2. Obtenemos el id de la venta recien creada
        const saleId = saleResult.insertId;

        // 3. Insertamos los productos en "ventas_productos"
        const sqlProductSale = `
            INSERT INTO ventas_productos (venta_id, producto_id, precio, cantidad) VALUES (?, ?, ?, ?)`;

        for (const item of arrayProductos) {
            const productId = item.id;
            const precio = item.precio;
            const cantidad = item.cantidad;

            await connection.query(sqlProductSale, [
                saleId,       // venta_id
                productId,    // producto_id
                precio,       // precio unitario o total, según tu BD
                cantidad      // cantidad
            ]);
}

        // Respuesta de exito
        res.status(201).json({
            message: "Venta registrada con exito!"
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
})



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