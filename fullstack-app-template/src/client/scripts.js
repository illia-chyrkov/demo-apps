fetch("/api")
  .then((res) => res.json())
  .then((res) => {
    document.querySelector("#app").innerHTML = res.message;
  });
