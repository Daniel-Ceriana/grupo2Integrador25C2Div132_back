import { Router } from "express";
import { productsView } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";
const router = Router();

router.get("/", requireLogin, productsView);
router.get("/index", requireLogin, productsView);

router.get("/consultar", requireLogin, (req, res) => {
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id",
        id:-1
    });
});
router.get("/consultar/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id",
        id
    });
});



router.get("/crear", requireLogin, (req, res) => {

    res.render("crear", {
        title: "Crear",
        about: "Crear"
    });
});

router.get("/modificar", requireLogin, (req, res) => {
    res.render("modificar", {
        title: "Modificar",
        about: "Actualizar producto",
        id:-1
    })
});
router.get("/modificar/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    res.render("modificar", {
        title: "Modificar",
        about: "Actualizar producto",
        id
    });
});

router.get("/eliminar", requireLogin, (req, res) => {
    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto"
    })
});


// Vista Login
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login"
    });
});

// Exportamos las rutas de las vistas
export default router;