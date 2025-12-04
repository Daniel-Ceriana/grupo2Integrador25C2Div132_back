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
const insertProduct = (nombre, imagen_direccion, precio, categoria,descripcion,empresa_responsable) => {

     let sql = "INSERT INTO productos (nombre, imagen_direccion, precio,categoria,descripcion,empresa_responsable) VALUES (?, ?, ?, ?, ?, ?)";

     // Le enviamos estos valores a la BBDD
     return connection.query(sql, [nombre, imagen_direccion,precio,categoria ,descripcion,empresa_responsable]);
}



// Actualizar producto
const updateProduct = (nombre, imagen_direccion, precio, categoria, id,activo,descripcion,empresa_responsable) => {

    let sql = `
        UPDATE productos
        SET nombre = ?, imagen_direccion = ?, precio = ?, categoria = ?, activo = ?, descripcion = ?, empresa_responsable = ?
        WHERE id = ?
    `;

    return connection.query(sql, [nombre, imagen_direccion, precio, categoria,activo,descripcion,empresa_responsable, id]);
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