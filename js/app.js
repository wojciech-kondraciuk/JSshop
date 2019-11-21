// variables
const popup = document.createElement("div");
const cartBtn = document.querySelector(".basket");
const cartItems = document.querySelector(".basket__item");
const cartTotal = document.querySelector(".cart__sum");
const cartContent = document.querySelector(".cart__list");
const productsDOM = document.querySelector(".listing");
const closeCart = document.querySelector(".cross");

let cart = [];
let buttonsDOM = [];

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
    let result = "";
    products.forEach(item => {
      result += `
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
    productsDOM.innerHTML = result;
  }

  displayModal = warning => {
    let md = `
      <div class="modal-content">
        <span class="close-button">×</span>
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

  addToCart() {
    let buttons = [...document.querySelectorAll(".product-txt__basket")];
    buttonsDOM = buttons;

    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", e => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;

        this.displayModal("dodano do koszyka");

        let cartItem = { ...Storage.getProduct(id), amount: 1 };
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

    cartTotal.innerText = parseFloat(tempTotal);
    cartItems.innerText = itemsTotal;
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
          <span class="cart--price">Price: <strong>${item.price}</strong> pln</span>
          <div class="cart--count">
            <input type="number" class="input__count" min="1" max="100" value="${item.amount}" data-id=${item.id}> art.
          </div>
        </div>
      </div>
      <div class="cart__del">
        <div class="btn__remove" data-id=${item.id}></i></div>
      </div>
    `;
    cartContent.appendChild(div);
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
        cartBtn.classList.toggle("show");
      } else {
        this.displayModal("Koszyk jest pusty");
      }
    });
    closeCart.addEventListener("click", () => {
      if (cartBtn.classList.contains("show")) {
        cartBtn.classList.remove("show");
      }
    });
  }

  cartOption() {
    cartContent.addEventListener("click", e => {
      if (e.target.classList.contains("btn__remove")) {
        let id = e.target.dataset.id;
        cartContent.removeChild(e.target.parentElement.parentElement);
        this.removeItem(id);
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
    button.disabled = false;
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
  const ui = new UI();
  const products = new Products();
  ui.setupAPP();

  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
    ui.addToCart();
    ui.cartOption();
  });
});
