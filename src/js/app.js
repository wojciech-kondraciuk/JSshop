("use strict");
// variables
const popup = document.createElement("div");
const cartBtn = document.querySelector(".basket");
const cartItems = document.querySelector(".basket__item");
const cartTotal = document.querySelector(".cart__sum");
const cartContent = document.querySelector(".cart__list");
const productsDOM = document.querySelector(".listing");
const closeCart = document.querySelector(".cross");
const buyBTN = document.querySelector(".cart__buy");
const cartAll = document.querySelector(".cart");

let cart = [];
let buttonsDOM = [];

// Feature test localStorage
if (!window.localStorage) {
  alert("localStorage does not exist, you can't shop");
}

class Products {
  async getProducts() {
    try {
      let response = await fetch("products.json");
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}

class Display {
  displayProducts(products) {
    let result = "";
    products.forEach(item => {
      result += `
      <div class="product">
        <a href="#" class="product__link">
          <img src="${item.url}" alt="${item.title}" class="product__img">
        </a>
        <div class="product-txt">
          <h6 class="product-txt__header">${this.trimText(item.name, 30)}...</h6>
          <button data-id="${item.id}" class="product-txt__basket">Add to cart</button>
          <div class="product-txt__price">${item.price} PLN</div>
        </div>
      </div>`;
    });
    productsDOM.innerHTML = result;
  }

  displayModal(warning, name) {
    let md = `
      <div class="modal-content">
        <span class="cross cross-modal"><i class="fas fa-times"></i></span>
        <h1 class="modal-header">${warning}</h1>
        <h2 class="modal-title">${name}</h2>
        <button class="modal-btn">Close</button>
      </div>`;

    popup.classList.add("modal");
    popup.innerHTML = md;
    document.body.appendChild(popup);
    const modal = document.querySelector(".modal");
    modal.classList.add("show-modal");

    if (modal.classList.contains("show-modal")) {
      modal.addEventListener("click", () => {
        modal.classList.remove("show-modal");
      });
    }
  }

  addToCart() {
    let buttons = [...document.querySelectorAll(".product-txt__basket")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.classList.add("in_cart");
      }
      button.addEventListener("click", e => {
        e.target.innerText = "In Cart";
        button.classList.add("in_cart");

        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        this.displayModal("Added to cart:", cartItem.title);

        cart = [...cart, cartItem];
        Storage.saveCart(cart);

        this.setCartValues(cart);
        this.addCartItem(cartItem);
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    itemsTotal > 0
      ? cartItems.classList.add("pulse")
      : cartItems.classList.remove("pulse");

    cartTotal.innerText = parseFloat(tempTotal).toFixed(2);
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
      <div class="cart__img">
        <img src="${item.url}" alt="" class="img">
      </div>
      <div class="cart__text">
        <div class="cart__text--shortcut">
          <h6 class="cart__text--name">${item.name}</h6>
          ${this.trimText(item.body, 150)}...
        </div>
        <div class="cart__text--price">
          <span class="cart--price">Price: <strong>${item.price}</strong> pln</span>
          <div class="cart--count">
            <input type="number" class="input__count" min="1" max="100" value="${item.amount}" data-id=${item.id}> art.
          </div>
        </div>
      </div>
      <div class="btn__remove" data-id=${item.id}>delete</div>
    `;
    cartContent.appendChild(div);
  }

  trimText(text, length) {
    return text.substring(0, length);
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    this.showHideCart();
  }

  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  showHideCart() {
    cartBtn.addEventListener("click", () => {
      if (parseFloat(cartItems.innerText) > 0) {
        cartAll.classList.toggle("show");
      } else {
        this.displayModal("Your shopping cart is empty", ":(");
      }
    });
    closeCart.addEventListener("click", () => {
      if (cartAll.classList.contains("show")) {
        cartAll.classList.remove("show");
      }
    });
    buyBTN.addEventListener("click", () => {
      this.displayModal("Shopping soon", ":)");
    });
  }

  cartOption() {
    cartContent.addEventListener("click", e => {
      if (e.target.classList.contains("btn__remove")) {
        let id = e.target.dataset.id;
        cartContent.removeChild(e.target.parentElement);
        this.removeItem(id);

        if (parseFloat(cartItems.innerText) <= 0) {
          cartAll.classList.remove("show");
        }
      }
      if (e.target.classList.contains("input__count")) {
        let id = e.target.dataset.id;
        let tempInCart = cart.find(item => item.id === id);
        tempInCart.amount = parseFloat(e.target.value);
        this.setCartValues(cart);
        Storage.saveCart(cart);
      }
    });
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.classList.remove("in_cart");
    button.innerText = "Add to cart";
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new Display();
  const products = new Products();
  ui.setupAPP();

  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
    ui.addToCart();
    ui.cartOption();
  });
});
