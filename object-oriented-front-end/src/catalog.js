export default class Catalog {
  constructor(selector) {
    this.$catalog = document.querySelector(selector);
    const cart = document.querySelector("#cart").Cart;

    document.addEventListener("click", e => {
      if (
        e.target &&
        e.target.classList.contains("catalog__item") &&
        this.$catalog.contains(e.target)
      ) {
        e.preventDefault();

        const item = {
          id: +e.target.dataset.id,
          name: e.target.dataset.name,
          price: +e.target.dataset.price
        };

        cart.addToCart(item);
      }
    });
  }
}
