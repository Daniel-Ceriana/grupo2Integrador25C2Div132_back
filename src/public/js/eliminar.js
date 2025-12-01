let url = `http://localhost:3000`;

let listaProductos = document.getElementById("lista-productos");
let getProductForm = document.getElementById("getProduct-form");

getProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());
    let idProd = data.idProd;

    let response = await fetch(`${url}/api/products/${idProd}`);
    let datos = await response.json();

    if (!response.ok) {
        mostrarError(datos.message || "Producto no encontrado");
        return;
    }

    let producto = datos.payload[0];

    if(producto.activo === 0){
        alert("El producto ya se encuentra inactivo");
        return;
    }

    let htmlProducto = `
        <li class="li-botonera">
            <input type="button" id="deleteProduct_button" value="Eliminar producto">
        </li>
        <li class="li-producto">
            <img class="producto-img" src="${producto.imagen_direccion}" alt="${producto.nombre}">
            <p>ID: <span>${producto.id}</span></p>
            <p>Nombre: <span>${producto.nombre}</span></p>
            <p>Precio: <span>$${producto.precio}</span></p>
            <p>Categoría: <span>${producto.categoria}</span></p>
            <p>Activo: <span>${producto.activo}</span></p>
            <p>Empresa responsable: <span>${producto.empresa_responsable}</span></p>
        </li>
    `;

    listaProductos.innerHTML = htmlProducto;

    let deleteProduct_button = document.getElementById("deleteProduct_button");

    deleteProduct_button.addEventListener("click", event => {
        event.stopPropagation();
        let confirmacion = confirm("Queres eliminar este producto?");

        if (!confirmacion) return;

        eliminarProducto(producto.id);
    });
});

async function eliminarProducto(id) {
    try {
        let response = await fetch(`${url}/api/products/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();

        if (!response.ok) {
            mostrarError(result.message || "No se pudo eliminar el producto");
            return;
        }

        listaProductos.innerHTML = "";
        alert(result.message);

    } catch (error) {
        console.error("Error: ", error);
        mostrarError("Ocurrió un error al eliminar el producto");
    }
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
