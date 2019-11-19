"use strict";

let cart = [];

class Products {
  async getAllProducts() {
    try {
      let response = await fetch("products.json");
      let data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }
}

class UI {
  displayProducts(products) {
    let output;
    products.forEach(item => {
      output += `
        <div class="product">
          <a href="#" class="product__link">
            <img src="#" alt="${item.title}" class="product__img">
          </a>
          <div class="product-txt">
            <h6 class="product-txt__header">${item.name}</h6>
            <div data-id="${item.id}" class="product-txt__basket">
              <i class="fas fa-shopping-basket"></i> Add to cart
            </div>
            <div class="product-txt__price">${item.id}</div>
          </div>
        </div>
      `;
    });
    document.querySelector("#listing").innerHTML = output;
  }

  getButtons() {
    const buttons = [...document.querySelectorAll(".product-txt__basket")];
    buttons.forEach(button => {
      let id = parseInt(button.dataset.id);
      let inCart = cart.find(item => item.id === id);

      if (inCart) {
        button.innerText = "Dodano";
        button.disabled = true;
      } else {
        button.addEventListener("click", e => {
          e.target.disabled = true;
          button.innerText = "Dodano";
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          cart = [...cart, cartItem];

          Storage.saveCart(cart);
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          this.showCart();
          alert("dodano");
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0,
      itemsTotal = 0;

    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    console.log(tempTotal);
    console.log(itemsTotal);
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.innerHTML = `tutaj miniaturki karty`;
    document.querySelector("#karta").appendChild(div);
  }
  showCart() {
    let show = "pokazywanie i ukrywanie kary";
  }
  hideCart() {
    let show = "ukrywanie kary";
  }
  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
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
  const ui = new UI();
  const products = new Products();

  ui.setupApp();

  products
    .getAllProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getButtons();
    });
});
