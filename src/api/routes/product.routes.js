// Importamos el middleware Router
import { Router } from "express";
const router = Router(); // Lo mismo que const app = express();

import { validateId } from "../middlewares/middlewares.js"; // Importamos el middleware
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";



////////////////
// READ -> GET
router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);


///////////////////
// CREATE -> POST
router.post("/", createProduct);



///////////////////
// UPDATE -> PUT
router.put("/", modifyProduct);


////////////////
// DELETE -> DELETE
router.delete("/:id", validateId, removeProduct);


// Exportamos todas las rutas
export default router;