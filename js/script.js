let cart = [];

async function loadProducts() {
  const res = await fetch("./products.json"); 
  const products = await res.json();

  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = ""; 
  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id}, \`${product.name}\`, ${product.price})">Agregar</button>
    `;
    productsContainer.appendChild(card);
  });
}

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCart();

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `${name} agregado al carrito`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  document.getElementById("total").textContent = `Total: $${total}`;
}

document.getElementById("clear-cart").addEventListener("click", () => {
  if (cart.length === 0) {
    Swal.fire("Tu carrito ya está vacío");
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Se vaciará todo tu carrito",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      updateCart();
      Swal.fire({
        icon: "success",
        title: "Carrito vacío",
        text: "Tu carrito ha sido vaciado correctamente"
      });
    }
  });
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    Swal.fire("Tu carrito está vacío");
    return;
  }
  Swal.fire({
    icon: "success",
    title: "Compra confirmada",
    text: "¡Gracias por tu compra!"
  });
  cart = [];
  updateCart();
});

loadProducts();
