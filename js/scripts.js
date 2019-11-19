("use strict");
const listing = document.createElement("div");
const popup = document.createElement("div");
const modal = document.querySelector(".modal");
const listItem = document.querySelector(".cart__list");
const basket = document.querySelector(".basket");

let cart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

class Products {
  async getAllProducts() {
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

  displayModal = warning => {
    let md = `
      <div class="modal-content">
        <span class="close-button"><i class="fas fa-times"></i></span>
        <h1>${warning}</h1>
      </div>
  `;
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
  };

  getButtons() {
    const buttons = [...document.querySelectorAll(".product-txt__basket")];
    buttons.forEach(button => {
      let id = parseInt(button.dataset.id);

      button.addEventListener("click", () => {
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        cart = [...cart, cartItem];

        const unique = Array.from(new Set(cart.map(a => a.id))).map(id =>
          cart.find(a => a.id === id)
        );

        // if (unique.includes(cartItem) == false) {
        //   this.displayModal("powtórka");
        // } else {
        //   this.displayModal("dodano");
        // }

        Storage.saveCart(unique);
        this.setCartValues(cart);
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0,
      itemsTotal = 0;

    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
  }
  showBasket(cart) {
    basket.addEventListener("click", () => {
      cart = Storage.getCart();
      listItem.innerHTML = "";
      for (var i in cart) {
        listItem.innerHTML += `
        <div class="cart__item">
        <div class="cart__img">
          <img src="${cart[i].url}" alt=""
            class="img">
        </div>
        <div class="cart__text">
          <h6 class="cart__text--name">${cart[i].name}</h6>
          <div class="cart__text--price">
            <span class="cart--price">Cena: <strong>${cart[i].price}</strong> pln</span>
            <div class="cart--count">
              <input type="number" name="counter" class="input__count" min="1" max="100" value="1"> szt.
            </div>
          </div>
        </div>
        <div class="cart__del">
          <button class="btn__remove"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
      `;
      }
      return listItem;
    });
  }

  setupApp() {
    this.setCartValues(cart);
    this.showBasket(cart);
  }
}

class Storage {
  static saveProducts(products) {
    return localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    return localStorage.setItem("cart", JSON.stringify(cart));
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

  products.getAllProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
    ui.getButtons();
  });
});
