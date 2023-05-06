const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");

const openModal1 = document.querySelector(".imgMare2");
const openModal2 = document.querySelector(".text2");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event
openModal1.addEventListener("click", openModal);
openModal2.addEventListener("click", openModal);