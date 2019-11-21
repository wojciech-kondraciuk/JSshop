// variables
const cartBtn = document.querySelector(".basket");
const cartItems = document.querySelector(".basket__item");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart__list");
const productsDOM = document.querySelector(".listing");
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
  getBagButtons() {
    let buttons = [...document.querySelectorAll(".product-txt__basket")];
    buttonsDOM = buttons;

    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

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
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
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
          <span class="cart--price">Cena: <strong>${item.price}</strong> pln</span>
          <div class="cart--count">
            <input type="number" name="counter" class="input__count" min="1" max="100" value="1"> szt.
          </div>
        </div>
      </div>
      <div class="cart__del">
      <button class="btn__remove" data-id=${item.id}>remove</button>
      </div>
    `;
    cartContent.appendChild(div);
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cartLogic() {
    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("btn__remove")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);

        this.removeItem(id);
      }
    });
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
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

  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
