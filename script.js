const resultNav = document.getElementById("resultNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector("images-container");
const saveConfirmed = document.querySelector("save-condirmed");
const loader = document.querySelector("loader");

const count = 1;
const apiKey = `DEMO_KEY`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
    const currrentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currrentArray.forEach((result) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "Nasa picture of the day";
    image.loading = "lazy";
    image.classList.add("card-img-top");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;

    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    saveText.textContent = "Add to Favorites";
    saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);

    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;

    const footer = document.createElement("small");
    footer.classList.add("text-muted");

    const date = document.createElement("strong");
    date.textContent = result.date;

    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;

    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.append(image);
    card.append(link, cardBody);
    imagesContainer.append(card);
  });
}

function updateDOM(page) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  createDOMNodes(page);
}

async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDOM('favorites');
  } catch (error) {
    console.log(error);
  }
}

function saveFavorite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

getNasaPictures();
