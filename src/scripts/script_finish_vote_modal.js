const new_modal = document.querySelector(".modal2");
const old_modal = document.querySelector(".modal");
const new_overlay = document.querySelector(".overlay");
const new_closeModalBtn = document.querySelector(".btn-close2");

const new_openModal1 = document.querySelector(".seeAwardsButton");
var new_openModal2 = document.getElementById("button2");
var new_openModal3 = document.getElementById("button3");
var new_openModal4 = document.getElementById("button4");

// close modal function
const new_closeModal = function () {
  new_modal.classList.add("hidden");
  new_overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
new_closeModalBtn.addEventListener("click", new_closeModal);
new_overlay.addEventListener("click", new_closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !new_modal.classList.contains("hidden")) {
    new_closeModal();
  }
});

// open modal function
const new_openModal = function () {
  old_modal.classList.add("hidden");
  new_modal.classList.remove("hidden");
  new_overlay.classList.remove("hidden");
};
// open modal event
new_openModal1.addEventListener("click", new_openModal);
new_openModal2.addEventListener("click", new_openModal);
new_openModal3.addEventListener("click", new_openModal);
new_openModal4.addEventListener("click", new_openModal);