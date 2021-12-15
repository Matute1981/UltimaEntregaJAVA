//Creo mis variables para luego obtener información de ellas

let nombre = document.getElementById("form-nombre");
let mail = document.getElementById("form-email");
let okVenta = document.getElementById("form-check");
let btnForm = document.getElementById("btn-form");
let formulario = document.getElementById("form");
const contenedorProductos = document.querySelector(
  ".shoppingCartItemsContainer"
);
const openForm = document.querySelector("#openForm");
const form = document.querySelector(".form");
const closeForm = document.querySelector(".form-close");
const closeModal = document.querySelector("#cerrar-modal");
const modal = document.querySelector(".modal-contenedor");

//Creo mis cards de forma dinámica mediante AJAX llamando a un json local.

$(document).ready(() => {
  const url = "json/api.json";

  $.get(url, function (respuesta, estado) {
    if (estado === "success") {
      let misDatos = respuesta;

      for (const dato of misDatos) {
        $("#card").append(
          `<div class="card" id="card">
            <div class="card-image">
              <img src=${dato.imagen} alt="" class="imgProduct"/>
            </div>
      
            <div class="card-nombreProducto">
              <h2 class="nombreProducto">${dato.nombre}</h2>
            </div>
            <div class="card-contenedor-precio">
              <div class="card-precio">
                <span>Precio $ </span>
              </div>
              <div class="card-precio"><p class="precioProducto">${dato.precio}</p></div>
            </div>
            <div class="card-agregarProducto">
            <button class="agregarProducto" id="boton${dato.id}">Agregar al carrito</button>
            </div>
      </div>`
        );
      }

      // Selecciono el boton de agregar producto y llamo a la función addProductClicked que lee la información de las cards

      const agregarProductoBoton =
        document.querySelectorAll(".agregarProducto");
      agregarProductoBoton.forEach((addBtn) => {
        addBtn.addEventListener("click", datosCard);
      });

      // Selecciono el botón de compra de carrito y luego llamo a la función validarForm

      const comprarButton = document.querySelector(".comprarButton");
      comprarButton.addEventListener("click", validarForm);

      //Función que lee el contenido de las cards para luego usar la información obtenida en el carrito

      function datosCard(event) {
        const button = event.target;
        const item = button.closest(".card");

        const itemTitle = item.querySelector(".nombreProducto").textContent;
        const itemPrice = item.querySelector(".precioProducto").textContent;
        const itemImage = item.querySelector(".imgProduct").src;

        addProductToShop(itemTitle, itemPrice, itemImage);
      }

      //Añaoe los productos al carrito

      function addProductToShop(itemTitle, itemPrice, itemImage) {
        const productTitle = contenedorProductos.getElementsByClassName(
          "shoppingCartItemTitle"
        );
        // Recorro las cards para que al agregar varias veces un producto no se duplique y aumente la cantidad del input
        for (let i = 0; i < productTitle.length; i++) {
          if (productTitle[i].innerText === itemTitle) {
            let cantidadElemento = productTitle[i].parentElement.parentElement.parentElement.querySelector(
              ".shoppingCartItemQuantity"
            );
            cantidadElemento.value++;

            //Actualizo el total del carrito
            actualizarTotalCarrito();
            return;
          }
        }

        // Creo los elementos del carrito dinámicamente

        const addElements = document.createElement("div");
        const contenidoProducto = `
        <div class="row shoppingCartItem">
        
            <div class="shopping-cart-item">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle">${itemTitle}</h6>
            </div>
        
        
            <div class="shopping-cart-price">
                <p class="item-price  shoppingCartItemPrice">${itemPrice}</p>
            </div>
        
        
            <div
                class="shopping-cart-quantity">
                <input class="shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="buttonDelete" type="button">X</button>
            </div>
            
        
        
        </div>`;
        addElements.innerHTML = contenidoProducto;
        contenedorProductos.append(addElements);

        //Selecciono el botón para eliminar productos del carrito y luego llamo a la función removerProducto
        addElements
          .querySelector(".buttonDelete")
          .addEventListener("click", removerProducto);

        //Selecciono el input de la cantidad del producto y luego llamo a la función cantidad elegida
        addElements
          .querySelector(".shoppingCartItemQuantity")
          .addEventListener("change", cantidadElegida);

        //Actualizo el total del carrito
        actualizarTotalCarrito();
      }

      //Función que me devuelve el total de los productos elegidos en el carrito
      function actualizarTotalCarrito() {
        let total = 0;
        const precioTotal = document.querySelector(".shoppingCartTotal");

        const shoppingCartItems =
          document.querySelectorAll(".shoppingCartItem");

        shoppingCartItems.forEach((shoppingCartItem) => {
          const itemProductPrice = shoppingCartItem.querySelector(
            ".shoppingCartItemPrice"
          );
          const shoppingCartItemPrice = parseInt(itemProductPrice.textContent);
          const shoppingCartItemQuantityElement =
            shoppingCartItem.querySelector(".shoppingCartItemQuantity");
          const itemCantidadProducto = parseInt(
            shoppingCartItemQuantityElement.value
          );
          total = total + shoppingCartItemPrice * itemCantidadProducto;
        });
        precioTotal.innerHTML = `$${total}`;
        return total;
      }

      //Función para eliminar productos del carrito
      function removerProducto(e) {
        const buttonClicked = e.target;
        buttonClicked.closest(".shoppingCartItem").remove();
        actualizarTotalCarrito();
      }
      //Función para que el usuario no pueda elegir un número negativo
      function cantidadElegida(e) {
        const input = e.target;
        if (input.value <= 0) {
          input.value = 1;
        }
        //Actualizo el total del carrito
        actualizarTotalCarrito();
      }

      //Utlizo jquery para abrir el carrito de compras

      $("#openShop").click(function (e) {
        e.preventDefault();
        $("#sidebar").css("right", 0);
      });

      //Utlizo jquery para cerrar el carrito de compras
      $("#cerrarCarrito").click(function (e) {
        e.preventDefault();
        $("#sidebar").css("right", "-100%");
      });

      //Si el total del carrito es igual a 0, muestro una alerta, sino se abre el formulario para finalizar la compra
      openForm.addEventListener("click", (e) => {
        total = actualizarTotalCarrito();
        e.preventDefault();
        if (total != 0) {
          form.classList.add("form-show");
        } else {
          alert("No ingresaste ningún producto");
          return false;
        }
      });

      //función para cerrar el formulario
      closeForm.addEventListener("click", (e) => {
        e.preventDefault();
        form.classList.remove("form-show");
      });

      //Utilizo jquery para abrir un modal cuando el usuario agregue un producto al carrito
      $(".agregarProducto").click((e) => {
        e.preventDefault();
        $(".modal").css({ opacity: 1, "pointer-events": "unset" });
      });

      // Utilizo jquery para cerrar el modal cuando el usuario da click en aceptar
      $("#modal-close").click((e) => {
        e.preventDefault();
        $(".modal").css({ opacity: 0, "pointer-events": "none" });
      });

      // Valido formulario de usuario

      function validarForm() {
        total = actualizarTotalCarrito();
        let formMensaje = document.getElementById("form-mensaje");

        btnForm.addEventListener("click", function (e) {
          e.preventDefault();
          if (nombre.value === "") {
            alert("Ingresa tu nombre");
            nombre.focus();
            return false;
          } else if (mail.value === "") {
            alert("Ingresa un e-mail");
            mail.focus();
            return false;
          } else if (okVenta.checked) {
            formMensaje.classList.add("form-msj");
            formMensaje.innerHTML = `<div>Gracias por tu compra ${nombre.value}, el total de tu compra es: $${total}</div>`;
          } else {
            formMensaje.classList.add("form-msj");
            formMensaje.innerHTML = `<div>Debes aceptar los términos y condicones de venta</div>`;
          }

          //Reseteo los valores del carrito
          const precioTotal = document.querySelector(".shoppingCartTotal");
          contenedorProductos.innerHTML = "";
          precioTotal.innerHTML = "$0";
        });
      }

      //GUARDO EL CLIENTE INGRESADO EN EL FORMULARIO EN EL LOCALSTORAGE

      function guardarUsuario(usuario) {
        btnForm.addEventListener("click", (e) => {
          e.preventDefault();
          let usuario = new Usuario(nombre.value, mail.value, okVenta.checked);
          let item = localStorage.getItem("listaUsuarios");
          if (item) {
            let almacenados = JSON.parse(localStorage.getItem("listaUsuarios"));
            almacenados.push(usuario);

            let almacenados_string = JSON.stringify(almacenados);
            localStorage.setItem("listaUsuarios", almacenados_string);
          } else {
            let almacenados = new Array();
            almacenados.push(usuario);
            let almacenados_string = JSON.stringify(almacenados);
            localStorage.setItem("listaUsuarios", almacenados_string);
          }
        });
      }
      guardarUsuario();
    }
  });
});