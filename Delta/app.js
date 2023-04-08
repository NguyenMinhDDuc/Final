const products = [];
const cart = [];

const productsContainer = document.querySelector("#products");
const cartContainer = document.querySelector("#cart-items");
const cartTotalContainer = document.querySelector("#cart-total");
const addProductModal = document.querySelector("#add-product-modal");
const addProductForm = document.querySelector("#add-product-form");
const closeModalBtn = document.querySelector(".close");

fetch("product.json")
  .then((res) => res.json())
  .then((data) => {
    products.push(...data);
    displayProducts(products);
  });

function displayProducts(products) {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productEl = document.createElement("div");
    productEl.classList.add("product");

    productEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} VND</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productsContainer.appendChild(productEl);
  });
}

function displayCart(cart) {
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");

    itemEl.innerHTML = `
      <img src="${item.product.image}" alt="${item.product.name}">
      <h3>${item.product.name}</h3>
      <p>${item.product.price} VND</p>
      <p>Quantity: ${item.quantity}
  <button class="remove-from-cart" data-id="${item.product.id}">Remove</button>
    `;

    cartContainer.appendChild(itemEl);
  });

  let total = 0;
  cart.forEach((item) => {
    total += item.product.price * item.quantity;
  });

  cartTotalContainer.innerHTML = `Total: ${total} VND`;
}

function addToCart(id) {
  const product = products.find((product) => product.id === id);
  const item = cart.find((item) => item.product.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ product, quantity: 1 });
  }

  displayCart(cart);
}

function removeFromCart(id) {
  const itemIndex = cart.findIndex((item) => item.product.id === id);

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  displayCart(cart);
}

productsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const id = parseInt(event.target.dataset.id);
    addToCart(id);
  }
});

cartContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart")) {
    const id = parseInt(event.target.dataset.id);
    removeFromCart(id);
  }
});

addProductForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#product-name").value;
  const imageInput = document.querySelector("#product-image");
  const imageFile = imageInput.files[0];
  const reader = new FileReader();
  const price = parseFloat(document.querySelector("#product-price").value);

  reader.onloadend = () => {
    const image = reader.result;
  
    products.push({
      id: products.length + 1,
      name,
      image,
      price,
    });
  
    displayProducts(products);
    addProductModal.style.display = "none";
  };
  reader.readAsDataURL(imageFile);  
});

closeModalBtn.addEventListener("click", () => {
  addProductModal.style.display = "none";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    addProductModal.style.display = "none";
  }
});
const openAddProductModalBtn = document.querySelector("#open-add-product-modal");

openAddProductModalBtn.addEventListener("click", () => {
  addProductModal.style.display = "block";
});
const checkoutBtn = document.querySelector("#checkout-btn");

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("empty cart");
  } else {
    alert("Payment successful");
    cart.length = 0; // Xóa giỏ hàng
    displayCart(cart);
  }
});
