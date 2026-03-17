const toggle = document.querySelector(".menu-toggle");
const navRight = document.querySelector(".nav-right");

toggle.addEventListener("click", () => {
navRight.classList.toggle("active");
});
