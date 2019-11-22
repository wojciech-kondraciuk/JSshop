//slider
const left = document.querySelector(".slide_nav-left");
const right = document.querySelector(".slide_nav-right");
let index = 1;

const showDivs = n => {
  let slides = document.querySelectorAll(".slide");

  n > slides.length ? (index = 1) : null;

  n < 1 ? (index = slides.length) : null;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.opacity = "0";
  }
  slides[index - 1].style.opacity = "1";

  if (slides.length == 1) {
    right.style.opacity = "0";
    left.style.opacity = "0";
  } else {
    right.style.opacity = "1";
    left.style.opacity = "1";
  }
};

const nextSlide = n => {
  showDivs((index += n));
};

showDivs(index);

left.addEventListener("click", () => {
  nextSlide(-1);
});

right.addEventListener("click", () => {
  nextSlide(+1);
});

// setInterval(function() {
//   nextSlide(+1);
// }, 4000);
