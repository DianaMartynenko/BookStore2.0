//dodanie do koszyka

updateCounterCart();

const containerBooks = document.getElementById("containerBooks");
const containerBooksKids = document.getElementById("containerBooksKids");

containerBooks.addEventListener("click", (e) => {
  const target = e.target;
  if (target.tagName !== "IMG" && target.tagName !== "BUTTON") return;
  if (target.tagName === "BUTTON") {
    const bookNumber = target.dataset.book;
    setItemLocalStorageForBook(bookNumber);
    updateCounterCart();
  }
  if (target.tagName === "IMG") {
    const bookNumberImg = target.dataset.bookimg;

    getJSONBooks(bookNumberImg, "desc");
  }
});

containerBooksKids.addEventListener("click", (e) => {
  const target = e.target;
  if (target.tagName !== "IMG" && target.tagName !== "BUTTON") return;
  if (target.tagName === "BUTTON") {
    const bookNumber = target.dataset.book;
    setItemLocalStorageForBook(bookNumber);
    updateCounterCart();
  }
  if (target.tagName === "IMG") {
    const bookNumberImg = target.dataset.bookimg;

    getJSONBooks(bookNumberImg, "desc");
  }
});

function updateCounterCart() {
  const counterCart = document.getElementById("counter-cart");
  const bookCartStr = localStorage.getItem("books");
  if (bookCartStr !== null) {
    const bookCart = JSON.parse(bookCartStr);
    let allBooks = 0;
    const keysBookArray = Object.keys(bookCart);
    keysBookArray.forEach((element) => {
      allBooks += Number(bookCart[element]);
    });
    counterCart.innerHTML = allBooks;
  } else {
    counterCart.innerHTML = 0;
  }
}

function setItemLocalStorageForBook(jdata) {
  const bookCartStr = localStorage.getItem("books");
  const keyName = "book" + jdata;
  if (bookCartStr !== null) {
    const bookCart = JSON.parse(bookCartStr);

    if (bookCart.hasOwnProperty(keyName)) {
      bookCart[keyName] = Number(bookCart[keyName]) + 1;
    } else {
      bookCart[keyName] = 1;
    }

    localStorage.setItem("books", JSON.stringify(bookCart));
  } else {
    const myObject = {};
    myObject[keyName] = 1;
    localStorage.setItem("books", JSON.stringify(myObject));
  }
}

//pokaż mi strone z opisem książki
function showDescBook(data, bookNumberImg) {
  localStorage.setItem("oldPage", localStorage.getItem("whichPage"));
  localStorage.setItem("whichPage", "descBook");
  saveScrollPosition();
  window.scrollTo(0, 0);
  const banner = document.querySelector(".banner");
  const carousel = document.querySelector(".carousel");
  const listBook = document.querySelectorAll(".list-book");
  const btnDesc = document.getElementById("btnDesc");
  btnDesc.setAttribute("data-numberbook", bookNumberImg);
  banner.style.display = "none";
  carousel.style.display = "none";
  listBook.forEach((element) => {
    element.style.display = "none";
  });
  document.querySelector(".book-desc").style.display = "block";
  document.getElementById("imgBookDesc").src = data["book" + bookNumberImg].img;
  document.getElementById("titleBook").innerHTML =
    data["book" + bookNumberImg].title;
  document.getElementById("author").innerHTML =
    data["book" + bookNumberImg].author;
  document.getElementById("cena").innerHTML =
    data["book" + bookNumberImg].price;
  document.getElementById("aboutText").innerHTML =
    data["book" + bookNumberImg].about;
}

//poberanie danych z serwera
function getJSONBooks(bookNumberImg, type, obj = {}) {
  fetch("json/listy.json?t=10")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json();
    })
    .then((data) => {
      if (type === "desc") {
        showDescBook(data, bookNumberImg);
      } else if (type === "cart") {
        getCartItems(data, obj);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

//dodaj do koszyka z strony opisu
const btnDesc = document.getElementById("btnDesc");
btnDesc.addEventListener("click", () => {
  setItemLocalStorageForBook(btnDesc.dataset.numberbook);
  updateCounterCart();
});

//pokaż koszyk

const cartContainer = document.querySelector(".cart-container");
const cartDiv = document.querySelector(".cart");

cartContainer.addEventListener("click", () => {
  if (localStorage.getItem("whichPage") !== "cartBook") {
    localStorage.setItem("oldPage", localStorage.getItem("whichPage"));
    localStorage.setItem("whichPage", "cartBook");
  }
  saveScrollPosition();

  window.scrollTo(0, 0);
  updateCounterCart();

  document.querySelector(".banner").style.display = "none";
  document.querySelector(".carousel").style.display = "none";
  document.querySelector(".book-desc").style.display = "none";

  const listBook = document.querySelectorAll(".list-book");
  listBook.forEach((element) => {
    element.style.display = "none";
  });

  cartDiv.style.display = "block";
  const booksCartStr = localStorage.getItem("books");

  if (booksCartStr !== null && booksCartStr !== "{}") {
    const bookCart = JSON.parse(booksCartStr);
    getJSONBooks("", "cart", bookCart);
  } else {
    document.querySelector(".empty-cart").style.display = "block";
    document.querySelector(".all-cart").style.display = "none";
  }
});

//pokaż listę z koszyku
function getCartItems(data, obj) {
  //data all
  //obj cart book
  document.querySelector(".empty-cart").style.display = "none";
  document.querySelector(".all-cart").style.display = "block";

  const keysBookArray = Object.keys(obj);

  document.querySelector(".all-cart-items").innerHTML = "";

  keysBookArray.forEach((element) => {

    const divCartItem = document.createElement("div");
    divCartItem.classList.add("all-cart-item");
    divCartItem.classList.add(element);
    divCartItem.setAttribute("data-numberbook", element);
    document.querySelector(".all-cart-items").appendChild(divCartItem);

    //create and add container img
    const imgCartItem = document.createElement("img");

    imgCartItem.classList.add("imgitems");
    imgCartItem.src = data[element]["img"];
    divCartItem.appendChild(imgCartItem);

    //create and add container pricecart
    const priceCartItem = document.createElement("p");

    priceCartItem.classList.add("pricecart");
    priceCartItem.innerText = data[element]["price"];
    divCartItem.appendChild(priceCartItem);

    //create and add container quantityDiv
    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("quantityDiv");
    divCartItem.appendChild(quantityDiv);

    const quantityP = document.createElement("p");

    quantityP.classList.add("quantity");
    quantityP.innerText = obj[element];
    quantityDiv.appendChild(quantityP);

    const plusMinusDiv = document.createElement("div");
    plusMinusDiv.classList.add("plus-minus");
    quantityDiv.appendChild(plusMinusDiv);

    const plus = document.createElement("p");
    const minus = document.createElement("p");
    plus.classList.add("plus");
    minus.classList.add("minus");
    plus.innerText = "+";
    minus.innerText = "-";
    plusMinusDiv.append(plus, minus);

    //create and add container total
    const totalCartItem = document.createElement("p");

    totalCartItem.classList.add("total");
    const priceWithoutDoll = Number(data[element]["price"].replace(/\$/g, ""));
    totalCartItem.innerText =
      "$" + (priceWithoutDoll * Number(obj[element])).toFixed(2);
    divCartItem.appendChild(totalCartItem);
    // }
  });

  totalPrice();
}

document.querySelector(".all-cart-items").addEventListener("click", (e) => {
  const target = e.target;
  if (!target.classList.contains("plus") && !target.classList.contains("minus"))
    return;
  const parentBook = target.closest(".all-cart-item");
  const bookNumber = parentBook.dataset.numberbook.replace("book", "");

  if (target.classList.contains("plus")) {
    setItemLocalStorageForBook(bookNumber);
    updateCartPlusMinus("plus", parentBook);
  } else if (target.classList.contains("minus")) {
    removeItemLocalStorageForBook(bookNumber);
    updateCartPlusMinus("minus", parentBook);
  }
  updateCounterCart();
  totalPrice();
});

function removeItemLocalStorageForBook(jdata) {
  const bookCartStr = localStorage.getItem("books");
  const keyName = "book" + jdata;
  if (bookCartStr !== null) {
    const bookCart = JSON.parse(bookCartStr);

    if (bookCart.hasOwnProperty(keyName)) {
      if (Number(bookCart[keyName]) >= 2) {
        bookCart[keyName] = Number(bookCart[keyName]) - 1;
      } else {
        delete bookCart[keyName];
      }
    }

    localStorage.setItem("books", JSON.stringify(bookCart));
  }
}

function updateCartPlusMinus(type, parent) {
  const pricecart = Number(
    parent.querySelector(".pricecart").textContent.replace(/\$/g, "")
  );
  const total = parent.querySelector(".total");
  let quantity = Number(parent.querySelector(".quantity").textContent);
  if (type === "plus") {
    quantity += 1;
  } else if (type === "minus" && quantity >= 1) {
    quantity -= 1;
  }

  total.innerHTML = "$" + (pricecart * quantity).toFixed(2);
  parent.querySelector(".quantity").innerHTML = quantity;
}

function saveScrollPosition() {
  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  localStorage.setItem("scrollPosition", scrollPosition);

}

function restoreScrollPosition() {
  const scrollPosition = localStorage.getItem("scrollPosition");
  window.scrollTo(0, scrollPosition);
}

function totalPrice() {
  const estimatedTotal2 = document.getElementById("estimatedTotal2");
  const estimatedTotal = document.getElementById("estimatedTotal");
  const totalsPrice = document.querySelectorAll(".total");
  let priceAll = 0;

  totalsPrice.forEach((element) => {
    let priceWithoutDoll = Number(element.innerHTML.replace(/\$/g, ""));
    priceAll += priceWithoutDoll;
  });

  estimatedTotal.innerText = "$" + priceAll.toFixed(2);
  estimatedTotal2.innerText = "$" + priceAll.toFixed(2);
}

//cofnuć na stronu głuwna

const arrowBackDesc = document.getElementById("arrowBackDesc");
const arrowBackCart = document.getElementById("arrowBackCart");

arrowBackDesc.addEventListener("click", () => {
  arrowBack("desc");
});
arrowBackCart.addEventListener("click", () => {
  arrowBack("cart");
});

function arrowBack(type) {
  const oldPage = localStorage.getItem("oldPage");
  const whichPage = localStorage.getItem("whichPage");

  type === "desc"
    ? (document.querySelector(".book-desc").style.display = "none")
    : (document.querySelector(".cart").style.display = "none");

  if (oldPage === "mainPage") {
    getMainPage();
  } else if (oldPage === "descBook") {
    document.querySelector(".book-desc").style.display = "block";
    localStorage.setItem("oldPage", "cartBook");
    localStorage.setItem("whichPage", "descBook");
  } else if (oldPage === "cartBook" && whichPage === "descBook") {
    getMainPage();
  }

  function getMainPage() {
    const banner = document.querySelector(".banner");
    const carousel = document.querySelector(".carousel");
    const listBook = document.querySelectorAll(".list-book");
    banner.style.display = "flex";
    carousel.style.display = "block";
    listBook.forEach((element) => {
      element.style.display = "block";
    });
    localStorage.setItem("oldPage", "descBook");
    localStorage.setItem("whichPage", "mainPage");
  }
  restoreScrollPosition();
}

//wyłącz opcję dodania poprzedniego dnia
const today = new Date();
const maxDate = new Date(today);
const minDate = new Date(today);
maxDate.setDate(maxDate.getDate() + 14);
minDate.setDate(minDate.getDate());

//string date
const maxDateString = maxDate.toISOString().split('T')[0];
const minDateString = minDate.toISOString().split('T')[0];
console.log(maxDateString);
console.log(minDateString);



document.getElementById("dateInput").setAttribute("min", minDateString);
document.getElementById("dateInput").setAttribute("max", maxDateString);




// kupić koszyk

document
  .getElementById("orderForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const selectedDate = document.getElementById("dateInput").value;
    if (document.getElementById("estimatedTotal2").innerHTML === "$0.00") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Empty shopping cart",
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thanks for the purchase",
        text: "Wait for the courier on " + selectedDate,
        showConfirmButton: false,
        timer: 1500,
      });
      localStorage.removeItem("books");
      setTimeout(() => {
        window.location.reload();
      }, 1501);
    }
  });

