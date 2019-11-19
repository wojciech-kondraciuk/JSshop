const listing = document.createElement("div");
const popup = document.createElement("div");
const modal = document.querySelector(".modal");

("use strict");

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
    let output;
    products.forEach(item => {
      output += `
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
    listing.innerHTML = output;
    listing.classList.add("listing");
    document.body.appendChild(listing);
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

  getButtons() {
    const buttons = [...document.querySelectorAll(".product-txt__basket")];
    buttons.forEach(button => {
      let id = parseInt(button.dataset.id);

      button.addEventListener("click", e => {
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        cart = [...cart, cartItem];

        const unique = Array.from(new Set(cart.map(a => a.id))).map(id =>
          cart.find(a => a.id === id)
        );

        if (unique.includes(cartItem) == false) {
          this.displayModal("powtórka");
        } else {
          this.displayModal("dodano");
        }

        Storage.saveCart(unique);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        this.showCart();
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
  addCartItem(item) {
    const div = document.createElement("div");
    div.innerHTML = `tutaj miniaturki karty`;
  }
  showCart() {
    let show = "pokazywanie i ukrywanie kary";
  }
  hideCart() {
    let show = " ukrywanie kary";
  }
  setupApp() {
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

// const toggleModal = () => {
//   modal.classList.toggle("show-modal");
// };

// const windowOnClick = e => {
//   if (e.target === modal) {
//     toggleModal();
//   }
// };

// window.addEventListener("click", windowOnClick);

// const modal = document.querySelector(".modal");

// if (document.body.classList.contains("show-modal")) {
//   modal.classList.remov("show-modal");
// } else {
//   modal.classList.add("show-modal");
// }
