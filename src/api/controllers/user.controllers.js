/*=============================
    Controladores usuario
=============================*/
import bcrypt from "bcrypt";

import UserModels from "../models/user.models.js";

export const insertUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if(!email ||!password) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los campos del formulario"
            });
        }

        // Setup de bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Con la contraseña hasheada
        const [rows] = await UserModels.insertUser(email, hashedPassword);
        
        res.status(201).json({
            message: "Usuario creado con exito",
            id: rows.insertId
        });

    } catch (error) {
        console.log("Error interno del servidor");

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
}