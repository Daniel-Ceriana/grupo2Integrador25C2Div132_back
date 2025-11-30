let url = `http://localhost:3000`;

// Seleccion de elementos del DOM
let listaProductos = document.getElementById("lista-productos");
let getProductForm = document.getElementById("getProduct-form");



getProductForm.addEventListener("submit", async (event) => {
    
    event.preventDefault(); // Prevenimos el envio por defecto del formulario

    
    let formData = new FormData(event.target); //Creamos un nuevo objeto FormData a partir de los datos del formulario


    // Transformamos a objetos JS los valores de FormData
    let data = Object.fromEntries(formData.entries());
    console.log(data); // { idProd: '2' }

    let idProd = data.idProd; // Ahora ya tenemos guardado en una variable el valor del campo del formulario
    console.log(idProd);

    console.log(`Realizando una peticion GET a la url ${url}/api/products/${idProd}`);
    
    // Enviamos en una peticion GET el id pegado a la url
    let response = await fetch(`${url}/api/products/${idProd}`);

    let datos = await response.json();

     // Extraemos de la respuesta payload, el primer resultado que contiene el objeto que consultamos
    let producto = datos.payload[0];
    console.log(producto);

    let htmlProducto = `
        <li class="li-producto">
                <img class="producto-img" src="${producto.image}" alt="${producto.name}">
                <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: ${producto.price}</strong></p>
        </li>
        <li class="li-botonera">
            <input type="button" id="deleteProduct_button" value="Eliminar producto">
        </li>
    `;

    listaProductos.innerHTML = htmlProducto;

    let deleteProduct_button = document.getElementById("deleteProduct_button");

    deleteProduct_button.addEventListener("click", event => {
        
        event.stopPropagation();

        let confirmacion = confirm("Queres eliminar este producto?");

        if(!confirmacion) {
            alert("Eliminacion cancelada");

        } else {
            eliminarProducto(producto.id);
        }
    })
});

async function eliminarProducto(id) {

    try {
        let response = await fetch(`${url}/api/products/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();

        if(response.ok) {
            alert(result.message);

            // Sacamos el producto listado de la pantalla
            listaProductos.innerHTML = "";

        } else {
            console.error("Error: ", result.message);
            alert("No se pudo eliminar el producto");
        }

    } catch (error) {
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar un producto");
    }
}