/*===========================
    Modelos producto
===========================*/
import connection from "../database/db.js"; // Importamos la conexion a la BBDD


// Seleccionar todos los productos
const selectAllProducts = () => {


        // Optimizacion 1: Seleccionar solamente los campos necesarios -> name, image, category, price porque es la unica informacion que necesita ver el cliente
        const sql = `SELECT * FROM productos`;
        return connection.query(sql); // Retorna una promesa que se resuelve en el controlador
}


// Seleccionar producto por id
const selectProductWhereId = (id) => {

      let sql = `SELECT * FROM productos where id = ?`;
      return connection.query(sql, [id]);
}


// Crear producto
const insertProduct = (name, image, category, price) => {

     let sql = "INSERT INTO productos (name, image, category, price) VALUES (?, ?, ?, ?)";

     // Le enviamos estos valores a la BBDD
     return connection.query(sql, [name, image, category, price]);
}



// Actualizar producto
const updateProduct = (name, image, price, category, id) => {

    let sql = `
        UPDATE productos
        SET name = ?, image = ?, price = ?, category = ?
        WHERE id = ?
    `;

    return connection.query(sql, [name, image, price, category, id]);
}


// Eliminar producto
const deleteProduct = (id) => {

      //Baja logica
      let sql = "UPDATE productos set activo = 0 WHERE id = ?";

      return connection.query(sql, [id]);
}




export default {
    selectAllProducts,
    selectProductWhereId,
    insertProduct,
    updateProduct,
    deleteProduct
}