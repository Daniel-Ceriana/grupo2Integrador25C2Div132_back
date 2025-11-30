// Importamos el middleware Router
import { Router } from "express";
import { insertUser } from "../controllers/user.controllers.js";
import connection from "../database/db.js";


import bcrypt from "bcrypt";
const router = Router();

router.post("/", insertUser);


// Creamos el endpoint que recibe los datos que enviamos del <form> del login.ejs
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; // Recibimos el email y el password

        if(!email || !password) {
            return res.render("login", {
                title: "login",
                error: "Todos los campos son necesarios!"
            });
        }



        const sql = "SELECT * FROM usuarios where email = ?";
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

        //si es el acceso rapido, se saltea el bcypt
        if(match || user.email == 'admin@gmail.com') {            
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

export default router;