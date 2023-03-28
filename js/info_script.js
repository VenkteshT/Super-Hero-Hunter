// api key
const KEYS = {
  PUBLIC_KEY: "938e1fe85de8f871993d51b228ba052b",
};

// MD5 Hash key
const key = "492836ee43545a445c66de5a9b29783b";

// local storage key
const about_character = "character-info";
const character = JSON.parse(localStorage.getItem(about_character));

// rendering the current section if the page reloads
let cur_section = localStorage.getItem("cur-section");
if (cur_section) {
  fetch_and_render(cur_section);
}
//

// container
const container = document.querySelector("#character-info");

// creating a card
const card = createCard(character);

// appending the card to container
container.append(card);

// function which creates card
function createCard(character) {
  // bootstrap classes
  const classes = [
    "card",
    "border",
    "border-3",
    "border-dark",
    "p-3",
    "rounded-2",
    "col-11",
    "col-lg-10",
    "h-75",
  ];

  let card = document.createElement("div");

  // adding bootstrap classes to element
  classes.forEach((cls) => card.classList.add(cls));

  card.innerHTML = `
        <div class="card-header ">
            <h3>${character.name}</h3>
        </div>
        <div class="card-body d-flex flex-row gap-1 gap-lg-3">
            <img src=${character.src} class="col-3 rounded-1 shadow img" alt=${
    character.name
  } />
            <div class="card border-0 col-8 col-lg-9">
                <div class="card-header">
                  <ul class="list-group d-xs-none d-flex flex-row about">
                  <li class="list-group-item ${
                    cur_section == "comics" ? "active" : ""
                  }" id="comics">
                   Comics
                  </li>
                   <li class="list-group-item ${
                     cur_section == "events" ? "active" : ""
                   }" id="events">
                    Events
                   </li>
                   <li class="list-group-item ${
                     cur_section == "stories" ? "active" : ""
                   }" id="stories">
                    Stories
                   </li>
                   <li class="list-group-item ${
                     cur_section == "series" ? "active" : ""
                   }" id="series">
                    Series
                   </li>
                  </ul>
                </div>
                <div class="card-body">
                  <ul id="content" class="col-12 list-group">
                  </ul>
                </div>
            </div>
        </div>
        <div class="card-footer col-12">
          <a href="../index.html" class="text-decoration-underline">Back</a>
        </div>
    `;
  return card;
}

// dynamically fetching the  data

document.addEventListener("click", (e) => {
  // check if the target has the required class or not

  if (e.target.classList.contains("list-group-item")) {
    // content section
    let content = document.querySelector("#content");

    // render Load text while api fetching the data
    content.innerHTML = `<p class="h4"> Loading...</p>`;

    // remove active class form all elements wheather it has not
    document
      .querySelectorAll(".list-group-item")
      .forEach((el) => el.classList.remove("active"));

    // add active class to current target
    e.target.classList.add("active");

    // getting the taget id;
    let attrib = e.target.id;

    // updating the current section
    localStorage.setItem("cur-section", attrib);

    // rendering the section
    fetch_and_render(attrib);
  }
});

//
function fetch_and_render(attrib) {
  // dynamically fetching the data from api
  fetch(
    `https://gateway.marvel.com/v1/public/characters/${character.id}/${attrib}?ts=1&apikey=${KEYS.PUBLIC_KEY}&hash=${key}`
  )
    .then((res) => {
      if (res.ok) return res.json();
      else {
        content.innerHTML = `<p class="h4"> something went wrong !</p>`;
      }
    })
    .then((data) => {
      // container
      // let content = document.querySelector("#content");
      content.innerHTML = "";

      // result array
      let res = data.data.results;

      // if result is empty render if block or render else block
      if (res.length == 0) {
        content.innerHTML = `<p class="h4"> No results found  !</p>`;
      } else {
        res.forEach((item, index) => {
          // create and append the list to content section
          let list = createList(item, index + 1);
          content.append(list);
        });
      }
    })
    .catch((err) => {
      alert(`Message: ${err}`);
    });
}

// create and retrun a list item
function createList(item, i) {
  let url;

  // check if the objects has the urls porperty or not
  if ("urls" in item) {
    url = `${item.urls[0].url}?ts=1&apikey=${KEYS.PUBLIC_KEY}&hash=${key}`;
  } else url = undefined;

  // bootstrap classes
  let classes = ["list-group-item", "d-flex", "flex-row", "gap-2"];
  let list = document.createElement("li");

  // adding bootstrap classes
  classes.forEach((cls) => list.classList.add(cls));
  list.innerHTML = `
    <span>${i}) </span> 
    <a href="${url ? url : "#"}" target="_blank"> ${item.title}</a>
  `;
  return list;
}

// git remote add origin https://github.com/VenkteshT/Super-Hero-Hunter
// git branch -M main
// git push -u origin main
