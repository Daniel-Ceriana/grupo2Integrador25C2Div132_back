/*================================
    Modelos de producto
================================*/

import connection from "../database/db.js"; // Traemos la conexion a la BBDD


// Traer todos los productos
const selectAllProducts = () => {

    /* Optimizacion 1: 
    - Seleccionemos solamente los campos necesarios, evitar SELECT *
    - Devolver solo las columnas que necesita el front
    - < datos transferidos, < carga de red, > seguridad*/
    const sql = "SELECT * FROM productos";

    // la conexion devuelve dos campos, rows con el resultado de la consulta, fields la informacion de la tabla productos
    return connection.query(sql);
}

const selectProductById = {}
const insertProduct = {}
const updateProduct = {}
const deleteProduct = {}

/*
// Traer producto por id
const selectProductById = (id) => {

    // Optimizacion 2: Limitar los resultados de la consulta: Evita el escaneo completo de la tabla
    //let sql = "SELECT * FROM productos WHERE productos.id = ? LIMIT 1";
    let sql = "SELECT * FROM productos WHERE productos.id = ?"; // ? son placeholders

    return connection.query(sql, [id]);
}



// Crear nuevo producto
const insertProduct = (nombre,  imagen_direccion, categoria, precio) => {
    let sql = "INSERT INTO productos (nombre,  imagen_direccion, categoria, precio) VALUES (?, ?, ?, ?)";

    return connection.query(sql, [nombre,  imagen_direccion, categoria, precio]);
}


// Modificar producto
const updateProduct = (nombre,  imagen_direccion, categoria, precio, activo, id) => {
    let sql = `
        UPDATE productos
        SET nombre = ?,  imagen_direccion = ?, categoria = ?, precio = ?, activo = ?
        WHERE id = ?
    `;

    return connection.query(sql, [nombre,  imagen_direccion, categoria, precio, activo, id]); // Estos valores en orden reemplazan a los placeholders -> ?
}


// Eliminar producto
const deleteProduct = (id) => {
     // Opcion 1: Hacer el borrado normal
     let sql = `DELETE FROM productos WHERE id = ?`;

     // Opcion 2: Baja logica
     let sql2 = `UPDATE productos set activo = 0 WHERE id = ?`;

     return connection.query(sql, [id]);
}
*/

export default {
    selectAllProducts,
    selectProductById,
    insertProduct,
    updateProduct,
    deleteProduct
}