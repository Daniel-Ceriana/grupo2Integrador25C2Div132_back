/*===============================
    Controladores producto
===============================*/

import ProductModels from "../models/product.models.js"

export const getAllProducts = async (req, res) => { 
    try {

        const [rows] = await ProductModels.selectAllProducts();
        
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });


    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}



////////////////////////
// Get product by id -> Consultar producto por su id
export const getProductById = async (req, res) => {
    try {

        // el :id se extrae con el objeto request -> req.params.id
        let { id } = req.params; // Esto nos permite obtener el valor numerico despues de products //2


        const [rows] = await ProductModels.selectProductWhereId(id);

        // Optimizacion 2: Comprobamos que existe el producto con ese id
        if(rows.length === 0) {
            console.log("Error, no existe producto con ese id");

            return res.status(404).json({
                message: `No se encontro producto con id ${id}`
            });
        }

        res.status(200).json({
            payload: rows
        });


    } catch (error) {
        console.error("Error obteniendo producto con id", error.message);

        res.status(500).json({
            error: "Error interno al obtener un producto con id"
        })
    }
}



//////////////////
// Crear producto
export const createProduct = async (req, res) => {
    try {
        const { nombre, imagen_direccion, categoria,precio } = req.body;
        // Aca imprimimos lo que enviamos desde el form que previamente se parseo gracias al middleware -> express.json()
        console.log(req.body); 

        // Optimizacion 1: Validacion datos de entrada
        if(!nombre || !imagen_direccion || !categoria || !precio) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los campos del formulario"
            });
            // return hace que el endpoint termine aca y el usuario solo reciba esta respuesta
        }

        let [rows] = await ProductModels.insertProduct(nombre, imagen_direccion, categoria, precio);
        // console.log(rows);

        // Devolvemos una respuesta 201 "Created"
        res.status(201).json({
            message: "Producto creado con exito",
            productId: rows.insertId
        });


    } catch (error) {
        console.error("Error interno del servidor");

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
}



// Modificar un producto
export const modifyProduct = async (req, res) => {
    try {
        let { id, nombre, imagen_direccion, categoria, precio, activo } = req.body;

        // Optimizacion 1: Validacion basica de datos
        if(!id || !nombre || !categoria || !precio || !activo) {
            return res.status(400).json({
                message: "Faltan campos requeridos"
            });
        }


        let [result] = await ProductModels.updateProduct(nombre, imagen_direccion, precio, categoria, id);
        console.log(result);

        // Optimizacion 2: Testeamos que se actualizara este producto
        if(result.affectedRows === 0) {
            return res.status(400).json({
                message: "No se actualizo el producto"
            });
        }

        res.status(200).json({
            message: "Producto actualizado correctamente"
        });
        

    } catch (error) {
        console.error("Error al actualizar el producto: ", error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
}



// Eliminar producto
export const removeProduct = async (req, res) => {
    try {
        let { id } = req.params;


        let [result] = await ProductModels.deleteProduct(id);
        console.log(result);
        // affectedRows: 1 -> Nos indica que hubo una fila que fue afectada

        if(result.affectedRows === 0) { // Quiere decir que no afectamos ninguna fila
            return res.status(404).json({
                message: `No se encontro un producto con id ${id}`
            });
        }


        return res.status(200).json({
            message: `Producto con id ${id} eliminado correctamente`
        });


    } catch (error) {
        console.log(`Error al eliminar un producto con id ${id}: `, error);

        res.status(500).json({
            message: `Error al eliminar un producto con id ${id}`,
            error: error.message
        })
    }
}