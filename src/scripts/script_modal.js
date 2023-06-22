async function fetchDatas() {
  const votedModal = document.querySelector(".modal2");
  const castVoteModal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const closeVoted = document.querySelector(".btn-close2");  //inchis deja votat
  const closeCast = document.querySelector(".btn-close"); //inchis votat
  const winnerImage = document.querySelector(".imgMare2 img");
  const openModal2 = document.querySelector(".text2");
  const description = document.querySelector(".text3");
  const currentCategoryId = 2;
  var winnerId;
  
  const apiKey = '9d086ab036170e8ab7e68ab954be6f58';
  const apiUrl1 = `http://localhost:3000/categoryWinner/${currentCategoryId - 1}`;
  const response1 = await fetch(apiUrl1);
  const data1 = await response1.json();
  winnerId = data1.winner;
  description.textContent = "sfdsfs";
  const winnerEndpoint = `https://api.themoviedb.org/3/person/${winnerId}?api_key=${apiKey}`;
  const winnerResponse = await fetch(winnerEndpoint);
  const winnerData = await winnerResponse.json();
  let imgsrc = winnerData.profile_path;

  winnerImage.src = `https://image.tmdb.org/t/p/w500${imgsrc}`;
  winnerImage.alt = winnerData.name;

  
  const apiUrl = `http://localhost:3000/categoryName/${currentCategoryId - 1}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  category = data.categoryName;

  description.textContent = winnerData.name + " is the winner of the " + category + " category";


  function closeModal() {
    votedModal.classList.add("hidden");
    castVoteModal.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  const openModal = async function () {
    var didVote;
    const apiUrl = `http://localhost:3000/getVoteFor/${currentCategoryId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    didVote = data.voted;

    if (didVote) {
      votedModal.classList.remove("hidden");
      castVoteModal.classList.add("hidden");
      overlay.classList.remove("hidden");
    } else {
      votedModal.classList.add("hidden");
      castVoteModal.classList.remove("hidden");
      overlay.classList.remove("hidden");
    }
  }
  winnerImage.addEventListener("click", openModal);
  openModal2.addEventListener("click", openModal);

  closeVoted.addEventListener("click", closeModal);
  closeCast.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}

fetchDatas();
