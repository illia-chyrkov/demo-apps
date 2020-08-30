import Cart from "./cart.js";
import Catalog from "./catalog.js";

const cart = new Cart("#cart");
const catalog = new Catalog("#catalog");

// document.querySelector("#cart").dispatchEvent(
//   new CustomEvent("addToCart", {
//     detail: { id: 1, name: "Товар 2", price: 7 }
//   })
// );

cart.addToCart({ id: 0, name: "Товар 1", price: 5 });

// cart.addEventListener("onAddToCart", e => {
//   console.log({ item: e.detail });
// });

cart.on("onAddToCart", item => {
  console.log({ item });
});
