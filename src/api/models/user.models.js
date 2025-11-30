/*=========================
    Modelos usuario
=========================*/
import connection from "../database/db.js";

// Crear usuario
const insertUser = (name, email, password) => {
    const sql = `INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)`;
    return connection.query(sql, [name, email, password]);
}

export default {
    insertUser
}