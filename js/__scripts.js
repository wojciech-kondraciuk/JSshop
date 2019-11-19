"use strict";

let cart = [];
let temp = JSON.parse(localStorage.getItem("inCart")) || [];

class Products {
  async getAllProducts() {
    try {
      let response = await fetch("products.json");
      cart = await response.json();
      return cart;
    } catch (err) {
      console.error(err);
    }
  }
}

class Display {
  showAllProducts(data) {
    let output;
    data.forEach(item => {
      output += `
        <div class="product">
          <a href="#" class="product__link">
            <img src="#" alt="${item.title}" class="product__img">
          </a>
          <div class="product-txt">
            <h6 class="product-txt__header">${item.name}</h6>
            <div data-id="${item.id}" class="product-txt__basket">
              <i class="fas fa-shopping-basket"></i>
            </div>
            <div class="product-txt__price">${item.postId}</div>
          </div>
        </div>
      `;
    });
    document.querySelector("#listing").innerHTML = output;
  }

  addToCart() {
    const buttons = [...document.querySelectorAll(".product-txt__basket")];

    buttons.forEach(button => {
      button.addEventListener("click", e => {
        e.preventDefault();
        let id = parseInt(button.dataset.id);
        let inCart = cart.find(item => item.id === id);

        let unique = Array.from(new Set(temp));
        temp.push(unique);
        //localStorage.setItem("inCart", JSON.stringify(unique));
        console.log(temp);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const display = new Display();

  products.getAllProducts().then(products => {
    display.showAllProducts(products);
    display.addToCart();
  });
});

const Modal = warning => {
  let modal = `
    <div class="modal">
      <div class="modal-content">
        <span class="close-button">×</span>
        <h1>${warning}</h1>
      </div>
    </div>
  `;
  document.body.innerHTML += modal;

  const modalHTML = document.querySelector(".modal");

  modalHTML.classList.toggle("show-modal");

  window.addEventListener("click", () => {
    modalHTML.classList.remove("show-modal");
  });
};
