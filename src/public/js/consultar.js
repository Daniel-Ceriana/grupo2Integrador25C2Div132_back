// import {port} from "../../api/config/environments";
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

    if(response.ok) {
        // Extraemos de la respuesta payload, el primer resultado que contiene el objeto que consultamos
        let producto = datos.payload[0];
        console.log(producto);

        mostrarProducto(producto);


    } else {
        console.log(datos);
        console.log(datos.message);

        mostrarError(datos.message);
    }


});

function mostrarProducto(producto) {
    let htmlProducto = `
            <li class="li-producto">
                    <img class="producto-img" src="${producto.image}" alt="${producto.name}">
                    <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: ${producto.price}</strong></p>
            </li>
        `;

    listaProductos.innerHTML = htmlProducto;
}


function mostrarError(message) {
    listaProductos.innerHTML = `
        <li class="mensaje-error">
            <p>
                <strong>Error:</strong>
                <span>${message}</span>
            </p>
        </li>
    `;
}

