("use strict");
const listing = document.createElement("div");
const total = document.querySelector(".total");
const totalItems = document.querySelector(".items");
const cartContent = document.querySelector(".cart__list");
const cartHTML = document.querySelector(".cart");
const basket = document.querySelector(".basket__item");

let cart = [];

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

class UI {
  displayProducts(products) {
    products.forEach(item => {
      listing.innerHTML += `
        <div class="product">
          <a href="#" class="product__link">
            <img src="#" alt="${item.title}" class="product__img">
          </a>
          <div class="product-txt">
            <h6 class="product-txt__header">${item.name}</h6>
            <button data-id="${item.id}" class="product-txt__basket">
              <i class="fas fa-shopping-basket"></i> Add to cart
            </button>
            <div class="product-txt__price">${item.id}</div>
          </div>
        </div>
      `;
    });

    listing.classList.add("listing");
    document.body.appendChild(listing);
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
          e.target.innerText = "dodano";
          e.target.disabled = true;

          let carItem = { ...Storage.getProduct(id), amount: 1 };

          cart = [...cart, carItem];

          Storage.saveCart(cart);
          this.setCartValues(cart);
          this.addCartItem(carItem);
          this.showCart();
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

    total.innerText = parseFloat(tempTotal);
    basket.innerText = parseFloat(itemsTotal);
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
      <div class="cart__img">
        <img src="${item.url}" alt=""
          class="img">
      </div>
      <div class="cart__text">
        <h6 class="cart__text--name">${item.name}</h6>
        <div class="cart__text--price">
          <span class="cart--price">Cena: <strong>${item.price}</strong> pln</span>
          <div class="cart--count">
            <input type="text" class="input__count" value="${item.amount}" data-id=${item.id}> szt.
          </div>
        </div>
      </div>
      <div class="cart__del">
        <button class="btn__remove" data-id=${item.id}><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartHTML.classList.add("showCart");
  }

  showItemInCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cardOperations(cart) {
    cartContent.addEventListener("click", e => {
      if (e.target.classList.contains("btn__remove")) {
        let id = parseFloat(e.target.dataset.id);
        cartContent.removeChild(e.target.parentElement.parentElement);
        cart = cart.filter(item => item.id !== id);
        Storage.saveCart(cart);
      }
    });

    let inputCount = document.querySelectorAll(".input__count");
    inputCount.forEach(item => {
      item.addEventListener("change", e => {
        let id = parseFloat(e.target.dataset.id);
        let tempItem = cart.find(item => item.id == id);
        tempItem.amount = e.target.value;
        Storage.saveCart(cart);
        this.setCartValues(cart);
      });
    });
  }

  app() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.showItemInCart(cart);
    this.cardOperations(cart);
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

  ui.app();

  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
    ui.getButtons();
  });
});
