/*=========================
    Modelos usuario
=========================*/
import connection from "../database/db.js";

// Crear usuario
const insertUser = (email, password) => {
    const sql = `INSERT INTO usuarios (email, password) VALUES (?, ?)`;
    return connection.query(sql, [email, password]);
}

export default {
    insertUser
}