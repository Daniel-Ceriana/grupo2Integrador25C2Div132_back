
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}]  ${req.method}  ${req.url}`);
    next(); 
}

const validateId = (req, res, next) => {
    const { id } = req.params;

    // Validamos que el id no sea un numero (la consulta podria fallar o generar un error en la BBDD)
    if(!id || isNaN(Number(id))) {
        return res.status(400).json({
            message: "El id del producto debe ser un numero valido"
        })
    };

    // Convertimos el parametro id a un numero entero (porque la url viene como string)
    req.id = parseInt(id, 10);

    console.log("Id validado: ", req.id);

    next();
}


// Middleware de ruta, para proteger las vistas si no se hizo login
const requireLogin = (req, res, next) => {
   
    if(!req.session.user) {
        return res.redirect("/login");
    }

    next();
}


export {
    loggerUrl,
    validateId,
    requireLogin
}