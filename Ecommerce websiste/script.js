const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

const mainImg = document.getElementById("MainImg");
const smallImg = document.getElementsByClassName("small-img");

if (mainImg && smallImg.length > 0) {
  if (smallImg[0]) {
    smallImg[0].onclick = function () {
      mainImg.src = smallImg[0].src;
    };
  }
  if (smallImg[1]) {
    smallImg[1].onclick = function () {
      mainImg.src = smallImg[1].src;
    };
  }
  if (smallImg[2]) {
    smallImg[2].onclick = function () {
      mainImg.src = smallImg[2].src;
    };
  }
  if (smallImg[3]) {
    smallImg[3].onclick = function () {
      mainImg.src = smallImg[3].src;
    };
  }
}

function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productName, price, image, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      name: productName,
      price: parseFloat(price),
      image: image,
      quantity: quantity,
    });
  }

  saveCart(cart);
  updateCartUI();
  alert(productName + " added to cart!");
}

function removeFromCart(productName) {
  let cart = getCart();
  cart = cart.filter((item) => item.name !== productName);
  saveCart(cart);
  updateCartUI();
}

function updateQuantity(productName, newQuantity) {
  const cart = getCart();
  const item = cart.find((item) => item.name === productName);

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productName);
    } else {
      item.quantity = newQuantity;
      saveCart(cart);
      updateCartUI();
    }
  }
}

function calculateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function updateCartUI() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartSummary = document.querySelector(".cart-summary");

  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>Your cart is empty</p>";
    cartSummary.innerHTML =
      "<h3>Order Summary</h3><p>Add items to your cart</p>";
    return;
  }

  let itemsHTML = "<h2>Your Selected Items</h2>";
  cart.forEach((item) => {
    const subtotal = (item.price * item.quantity).toFixed(2);
    itemsHTML += `
      <div class="cart-item">
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="item-details">
          <h4>${item.name}</h4>
          <p class="item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="item-quantity">
          <input type="number" value="${item.quantity}" min="1" 
            onchange="updateQuantity('${item.name}', this.value)" />
        </div>
        <div class="item-subtotal">
          <p>$${subtotal}</p>
        </div>
        <div class="item-remove">
          <a href="#" class="remove-btn" onclick="removeFromCart('${item.name}'); return false;">
            <i class="fas fa-trash-alt"></i>
          </a>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = itemsHTML;

  const totals = calculateTotals();
  cartSummary.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row">
      <span>Subtotal (${totals.itemCount} items)</span>
      <span>$${totals.subtotal}</span>
    </div>
    <div class="summary-row">
      <span>Tax (10%)</span>
      <span>$${totals.tax}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>FREE</span>
    </div>
    <hr />
    <div class="summary-row" style="font-weight: bold; font-size: 1.2em;">
      <span>Total</span>
      <span>$${totals.total}</span>
    </div>
    <button class="checkout-btn normal" style="width: 100%; margin-top: 20px;">
      Proceed to Checkout
    </button>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const productName = this.getAttribute("data-product-name");
      const price = this.getAttribute("data-price");
      const image = this.getAttribute("data-image");
      const quantityInput = this.parentElement.querySelector(
        'input[type="number"]',
      );
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      addToCart(productName, price, image, quantity);
    });
  });

  if (document.querySelector(".cart-items")) {
    updateCartUI();
  }
});
