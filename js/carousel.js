//CAROUSEL
localStorage.setItem("whichPage", "mainPage");
localStorage.removeItem("oldPage");

const carouselImgSrc = {
  1: "img/book1.avif?t=2",
  2: "img/book2.avif?t=2",
  3: "img/book3.jpg?t=2",
};

const carousel = document.querySelector(".carousel");

carousel.addEventListener("click", (e) => {
  if (e.target.id == "carousel-img") return;
  const targetId = e.target.id;
  const carouselImg = document.getElementById("carousel-img");
  let imgNumbers = carouselImg.dataset.img;

  if (targetId == "carousel-left") {
    if (imgNumbers == 1) {
      imgNumbers = 3;
    } else {
      imgNumbers = +imgNumbers - 1;
    }
  } else if (targetId == "carousel-right") {
    if (imgNumbers == 3) {
      imgNumbers = 1;
    } else {
      imgNumbers = +imgNumbers + 1;
    }
  }

  carouselImg.style.backgroundImage = `url('${carouselImgSrc[imgNumbers]}')`;
  carouselImg.dataset.img = imgNumbers;
});
