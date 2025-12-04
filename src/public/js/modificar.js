let url = `http://localhost:3000`;


// Seleccion de elementos del DOM
let contenedorProducto = document.getElementById("contenedor-producto");
let getProductForm = document.getElementById("getProduct-form");
// let updateFormContainer = document.getElementById("updateFormContainer");
const id = document.getElementById("productoId").value;

getProductForm.addEventListener("submit", (event) => desglosarEvento(event));

function desglosarEvento(event) {
    event.preventDefault(); // Prevenimos el envio por defecto del formulario
    let formData = new FormData(event.target); //Creamos un nuevo objeto FormData a partir de los datos del formulario


    // Transformamos a objetos JS los valores de FormData
    let data = Object.fromEntries(formData.entries());
    console.log(data); // { idProd: '2' }

    let idProd = data.idProd; // Ahora ya tenemos guardado en una variable el valor del campo del formulario
    pedirItem(idProd);
}

if(id>0){
    pedirItem(id);
}

async function pedirItem(idProd) {
 // Enviamos en una peticion GET el id pegado a la url
 let response = await fetch(`${url}/api/products/${idProd}`);

 let datos = await response.json();
 console.log(datos);

  // Extraemos de la respuesta payload, el primer resultado que contiene el objeto que consultamos
 let producto = datos.payload[0]; // Accedo al objeto que se encuentra en la posicion 0 de payload
 console.log(producto);

 let htmlProducto = `
 
 <li class="li-producto">
 <img class="producto-img" src="${producto.imagen_direccion}" alt="${producto.nombre}">
 <div class="descripcion-lateral">
     <p>ID: <span>${producto.id}</span></p>
     <p>Nombre: <span>${producto.nombre}</span></p>
     <p>Precio: <span>$${producto.precio}</span></p>
     <p>Categoría: <span>${producto.categoria}</span></p>
     <p>Activo: <span>${producto.activo}</span></p>
     <p>Empresa responsable: <span>${producto.empresa_responsable}</span></p>
 </div>
</li>
     <div class="li-botonera">
         <input class='btn' type="button" id="updateProduct_button" value="Actualizar producto">
     </div>
 `;

 contenedorProducto.innerHTML = htmlProducto;

 let updateProduct_button = document.getElementById("updateProduct_button");

 updateProduct_button.addEventListener("click", event => {
     
     event.stopPropagation();

     crearFormulario(producto);
 });
}
   


async function crearFormulario(producto) {
    console.table(producto);

    let updateFormHTML = `
    <form id="modificarProducts-container" class="form-modificar">

    <label for="idProd">id</label>
    <input type="text" name="id" id="idProd" value="${producto.id}" disabled required>

    <label for="nombreProd">Nombre</label>
    <input type="text" name="nombre" id="nombreProd" value="${producto.nombre}" required>

    <label for="imagenProd">Imagen</label>
    <input type="text" name="imagen_direccion" id="imagenProd" value="${producto.imagen_direccion}" required>

    <label for="precioProd">Precio</label>
    <input type="number" name="precio" id="precioProd" min="0" step='any' value="${producto.precio}" required>

    <label for="categoriaProd">Categoria</label>
    <select name="categoria" id="categoriaProd" value="${producto.categoria}" required>
    <option value="juego" ${producto.categoria === "juego" ? "selected" : ""}>Juego</option>
    <option value="consola" ${producto.categoria === "consola" ? "selected" : ""}>Consola</option>

    </select>

    <label for="activoProd">Activo:</label>
    <select name="activo" id="activoProd" required>
    <option value="1" ${producto.activo == 1 ? "selected" : ""}>Activo</option>
    <option value="0" ${producto.activo == 0 ? "selected" : ""}>No activo</option>

</select>

    <label for="descripcionProd">Descripcion</label>
    <textarea name="descripcion" id="descripcionProd" cols="30" rows="10">${producto.descripcion}</textarea>

    <label for="empresaProd">Empresa responsable</label>
    <input type="text" name="empresa_responsable" id="empresaProd" value="${producto.empresa_responsable}" required>

    <input id="updateProducts_form" class="submit btn" type="submit" value="Actualizar producto">
</form>
    `;

    contenedorProducto.innerHTML = updateFormHTML;

    let modificarProductsContainer = document.getElementById("modificarProducts-container");
    modificarProductsContainer.addEventListener("submit", event => {
        event.preventDefault();
        event.stopPropagation();

        actualizarProducto(event,producto.id);
    });
}


async function actualizarProducto(event,id) {

    console.log("Preparando datos del formulario para el PUT");

    let formData = new FormData(event.target); // Le pasamos el formulario dinamico de antes al objeto FormData para obtener los datos del nuevo formulario de actualizacion

    let data = Object.fromEntries(formData.entries());
    data.id=id;
    data.activo = parseInt(data.activo);
    console.log('estos datos se pasan:');
    console.log(data); // Ya tenemos como objetos JS los datos de nuestro formulario anterior con las nuevas modificaciones

    try {
        let response = await fetch(`${url}/api/products`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        console.log(result);

        if(response.ok) {
            console.log(result.message);
            alert(result.message);
        } else {
            // TO DO
            console.log(result.message);
            alert(result.message);
        }

    } catch (error) {

    }
    
}