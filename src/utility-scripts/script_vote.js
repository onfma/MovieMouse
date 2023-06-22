const loadVoteModule = async () => {
    const new_modal = document.querySelector(".modal2");
    const old_modal = document.querySelector(".modal");
    const new_overlay = document.querySelector(".overlay");
    const new_closeModalBtn = document.querySelector(".btn-close2");
  
    var button1 = document.getElementById("button1");
    var button2 = document.getElementById("button2");
    var button3 = document.getElementById("button3");
    var button4 = document.getElementById("button4");
  
    const voteText = document.querySelector("#voteText");
    const mainCategory = document.querySelector("#mainCategory");
  
    const apiKey = '9d086ab036170e8ab7e68ab954be6f58';
    const currentCategoryId = 2;
    const nomineesArray = [];
  
    const apiUrl = `http://localhost:3000/categoryName/${currentCategoryId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const category = data.categoryName;
  
    voteText.textContent = "Vote for this week's category of " + category + " and follow our site for results";
    mainCategory.textContent = category;
  
    const apiUrlNominees = `http://localhost:3000/getCategoryNominees/${currentCategoryId}`;
    const responseNominees = await fetch(apiUrlNominees);
    const dataNominees = await responseNominees.json();
    nomineesArray.push(dataNominees.nominees);
  
    const imageColumns = document.querySelectorAll('#canditati .image_column');
  
    for (let i = 0; i < 4; i++) {
      const personId = nomineesArray[0][i];
      const imageColumn = imageColumns[i];
      const personEndpoint = `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`;
      const personResponse = await fetch(personEndpoint);
      const personData = await personResponse.json();
  
      const img = imageColumn.querySelector('img');
      img.src = `https://image.tmdb.org/t/p/w500${personData.profile_path}`;
      img.alt = personData.name;
  
      const captionDate = imageColumn.querySelector('.image_caption_date');
      captionDate.textContent = "";
  
      const captionTitle = imageColumn.querySelector('.image_caption_title');
      captionTitle.textContent = personData.name;
    }
  
    button1.addEventListener("click", () => {
      voteFor(0);
      new_openModal();
    });
    button2.addEventListener("click", () => {
      voteFor(1);
      new_openModal();
    });
    button3.addEventListener("click", () => {
      voteFor(2);
      new_openModal();
    });
    button4.addEventListener("click", () => {
      voteFor(3);
      new_openModal();
    });
  
    const voteFor = function (index) {
      actorId = nomineesArray[index];
      console.log(actorId);
      fetch(`http://localhost:3000/voteFor/${actorId}`, {
        method: 'POST',
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error voting for actor:', error);
        });
    };
  
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !new_modal.classList.contains("hidden")) {
        new_closeModal();
      }
    });
  
    const new_openModal = function () {
      old_modal.classList.add("hidden");
      new_modal.classList.remove("hidden");
      new_overlay.classList.remove("hidden");
    };
  
  };
  
  loadVoteModule();
  