// api key
const KEYS = {
  PUBLIC_KEY: "938e1fe85de8f871993d51b228ba052b",
};

// MD5 Hash key
const key = "492836ee43545a445c66de5a9b29783b";

// localstorage key
const storage_key = "favourites";
const about_character = "character-info";
// global varibale to store favourites heros list;
let favourites;

// check if there are heros present in favourites list.
let has_favourites = JSON.parse(localStorage.getItem(storage_key));

// if no favourites hero in list set the localstorege to empty list;
if (!has_favourites) localStorage.setItem(storage_key, JSON.stringify([]));

localStorage.setItem(about_character, JSON.stringify({}));

// elements
const container = document.querySelector("#main-container");
const btn_search = document.querySelector(".btn-search");
const input_bar = document.querySelector("#search-bar");

// Fetch super heros
async function fetch_superHero_characters() {
  try {
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${KEYS.PUBLIC_KEY}&hash=${key}`
    );
    const result = await response.json();
    return result;
  } catch (err) {
    alert(`Message: ${err.message}`);
  }
}

// fetch super heros by name
async function fetch_superHero_characters_by_name(name) {
  try {
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${KEYS.PUBLIC_KEY}&hash=${key}`
    );
    const result = await response.json();
    console.log(result);
    if (result.data.results.length == 0) {
      container.innerHTML = `<p class="h2"> Invalid character Name ! </p>`;
      return;
    }
    container.innerHTML = ``;
    result.data.results.forEach((Hero) => {
      if (Hero.name.toLowerCase().includes(name.toLowerCase())) {
        appendHero(Hero);
      }
    });
  } catch (err) {
    alert(`Message: ${err.message}`);
  }
}

// a function which renders super heros list
function render() {
  container.innerHTML = "";
  fetch_superHero_characters().then((result) => {
    let data = result.data.results;
    data.forEach(appendHero);
  });
}
render();

// a callback function for forEach
function appendHero(Hero) {
  //
  // creating a card for hero
  let card = create_Card_for(Hero);

  // appending the card to contianer
  container.append(card);
}

// a function which creates and return the card
function create_Card_for(character) {
  // getting a favourites hero list
  favourites = JSON.parse(localStorage.getItem(storage_key));

  // checking if the current hero present in favourites list or not
  let has_hero = favourites.find((hero) => hero.id == character.id);

  // careteing an array of bootstrap classes
  let classes = ["card", "col-3", "shadow"];

  // creating a element and adding bootstrap classes
  const div = document.createElement("div");
  classes.forEach((cls) => div.classList.add(cls));

  let src =
    character.thumbnail.path +
    "/portrait_fantastic." +
    character.thumbnail.extension;
  let link = character.urls[0].url;
  let id = character.id;
  let name = character.name.split(" ").join("_");

  div.innerHTML = `
        <h5 class="h5 card-header mt-2 mr-2">${character.name}</h5>
        <div class="card-body">
        <img src=${src} alt=${
    character.name
  } class="shadow col-12 h-100 rounded-1"/>
        <i class="fa fa-heart ${
          has_hero ? "add-to-favourites" : ""
        }"data-el-id=${id} data-el-name=${name} data-el-src=${src}></i>
        </div>
        <a class="card-footer" href=${"./info.html"} data-el-id=${id} data-el-name=${name} data-el-src=${src} >more information</a> 
    `;
  return div;
}

// adding and removeing characters from favourites list through event deligation
document.addEventListener("click", (e) => {
  // updateing the about character functionality
  const target = e.target;
  // check if current target has required class or not
  if (target.classList.contains("card-footer")) {
    //
    let id = target.getAttribute("data-el-id");
    let name = target.getAttribute("data-el-name");
    let src = target.getAttribute("data-el-src");

    let obj = {
      id,
      name,
      src,
    };

    // update about character
    localStorage.setItem(about_character, JSON.stringify(obj));
  }

  // addding and removeing form favourites  list functionality
  // check if the target has required class or not.
  if (target.classList.contains("fa-heart")) {
    // getting favourites list
    favourites = JSON.parse(localStorage.getItem(storage_key));

    // getting data attributes
    let id = target.getAttribute("data-el-id");
    let name = target.getAttribute("data-el-name");
    let src = target.getAttribute("data-el-src");

    target.classList.toggle("add-to-favourites");

    // check if the character present in favourites list. if present remove else add
    let index = favourites.findIndex((el) => el.id == id);
    if (index == -1) {
      favourites.push({
        id,
        name,
        src,
      });
    } else {
      let res = favourites.filter((el) => el.id !== id);
      favourites = res;
      render();
    }

    // updating favourites list
    localStorage.setItem(storage_key, JSON.stringify(favourites));
  }
});

// click on search button;
btn_search.addEventListener("click", (e) => {
  let value = input_bar.value;
  value = value[0].toUpperCase() + value.slice(1);
  container.innerHTML = `<p class="h2"> Loading please wait... </p>`;
  fetch_superHero_characters_by_name(value);
});

// on input change
input_bar.addEventListener("keyup", (e) => {
  //  if the search bar value is empty render all super heros.
  if (!input_bar.value) {
    render();
  }
});
