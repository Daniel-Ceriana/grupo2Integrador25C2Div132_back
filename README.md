# Gaming shop (back-end).
Cruds para manejo de usuarios, ventas, productos

Rutas base:

**/api/products**


  Get:
    / Devuelve todos los productos
    /:id Devuelve el producto con mismo id

    
  Post:
    / Crea un nuevo producto

    
  Put:
    / Modifica un producto

    
  Delete:
    /:id Realiza una baja logica del producto pasado

/ Sirve para las vistas, redirige al index

**/api/users:**


  /Post: Crea un nuevo usuario 

  
  /login Post: Verifica que los datos existan para loguearse

  
  /logout Destruye la sesion
  
   
**/api/sales**


  Post: Guarda los datos de las ventas realizadas
