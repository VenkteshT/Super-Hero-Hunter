// Local storage Key
const storage_key = "favourites";

// favourites List present in localstorage
let favourites = JSON.parse(localStorage.getItem(storage_key));

// favourites container
let container = document.querySelector("#favourites");

// function which renders favourites super heros list
function render() {
  container.innerHTML = "";
  favourites.forEach(appendHero);
}
render();

// callback function 
function appendHero(Hero) {
  
  // createing a card for Hero
  let card = create_Card_for(Hero);

  // appending the cards to container
  container.append(card);
}

// a function which creates card and retrun the card 
function create_Card_for(character) {
  
  //  bootstrap classes
  let classes = ["card", "col-9", "col-lg-8", "shadow"];
  const div = document.createElement("div");

  // adding the bootstrap classes to the created element
  classes.forEach((cls) => div.classList.add(cls));

  let id = character.id;
  let name = character.name;
  let src = character.src;

  // checking if the current hero present in favourites list or not. if the page reloads 
  //if present make super hero icon as favourites   
  let has_hero = favourites.find((el) => el.id == character.id);

  div.innerHTML = `
        <h5 class="h5 card-header mt-2 mr-2">${character.name}</h5>
        <div class="card-body">
        <img src=${src} alt=${ character.name } class="shadow col-12 h-100 rounded-1"/>
        <i class="fa fa-heart ${ has_hero ? "add-to-favourites" : "" }" data-el-id=${id} data-el-name=${name} data-el-src=${src}></i>
        </div>
      <div class="card-footer"></div> 
    `;
  return div;
}

// adding or removing a hero from favourites list throught even deligation
document.addEventListener("click", (e) => {
  
  const target = e.target;

  // check if the target has the required class
  if (target.classList.contains("fa-heart")) {
    
    // getting attributes from element
    let id = target.getAttribute("data-el-id");
    let name = target.getAttribute("data-el-name");
    let src = target.getAttribute("data-el-src");

    target.classList.toggle("add-to-favourites");

    // checking if the hero is already in favourites list or not
    let index = favourites.findIndex((el) => el.id == id);
    
    // if already present remove  else add
    if (index == -1) {
      favourites.push({
        id,
        name,
        src,
      });
    } else {
      let res = favourites.filter((el) => el.id !== id);
      favourites = res;
    }

    // updateing favourites list and rerendering
    localStorage.setItem(storage_key, JSON.stringify(favourites));
    render();
  }
});
