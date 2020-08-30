import Emmiter from "tiny-emitter";

export default class Cart extends Emmiter {
  constructor(selector) {
    super();

    this.list = [];
    this.sum = 0;

    this.$cart = document.querySelector(selector);
    this.$list = this.$cart.querySelector(".cart__list");
    this.$sum = this.$cart.querySelector(".cart__sum");

    this.calcSum();
    this.renderCart();

    // this.$cart.addEventListener("addToCart", ({ detail }) =>
    //   this.addToCart(detail)
    // );

    this.$cart.Cart = this;
  }

  addToCart(item) {
    const existingItem = this.list.find(_item => _item.id === item.id);

    if (existingItem) existingItem.count++;
    else {
      item.count = 1;
      this.list.push(item);
    }

    this.calcSum();
    this.renderCart();

    // this.dispatchEvent("onAddToCart", item);
    this.emit("onAddToCart", item);
  }

  renderCart() {
    this.$list.innerHTML = "";
    this.list.forEach(item => {
      this.$list.innerHTML += `
      <li class="cart__item">
        <span class="cart__item-count">${item.count}</span> -
        <span class="cart__item-name">${item.name}</span> -
        <span class="cart__item-price">${item.price * item.count}</span>$
      </li>
      `;
    });
    this.$sum.innerText = `Сумма: ${this.sum}$`;
  }

  calcSum() {
    this.sum = 0;
    this.list.forEach(item => {
      this.sum += item.price * item.count;
    });
  }

  // addEventListener(e, cb) {
  //   this.$cart.addEventListener(e, cb);
  // }

  // removeEventListener(e, cb) {
  //   this.$cart.removeEventListener(e, cb);
  // }

  // dispatchEvent(e, data) {
  //   this.$cart.dispatchEvent(
  //     new CustomEvent(e, {
  //       detail: data
  //     })
  //   );
  // }
}
