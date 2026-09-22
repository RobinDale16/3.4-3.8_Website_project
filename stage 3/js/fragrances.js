// WorldNose | fragrances.js
// Makes the Fragrances page work: search boxes, filter chips and the favourite (heart) buttons.
// Each fragrance card in the HTML has data- attributes (data-notes, data-creator, data-date, data-family)
// so this file can read them and decide which cards to show.

// ---------- 1. Grab the things I need from the page ----------
let cards = document.querySelectorAll(".perfume-card");
let chips = document.querySelectorAll(".chip");
let searchForm = document.getElementById("searchForm");
let notesBox = document.getElementById("s-notes");
let creatorBox = document.getElementById("s-creator");
let dateBox = document.getElementById("s-date");
let countText = document.getElementById("resultCount");
let emptyMsg = document.getElementById("emptyMsg");
let clearBtn = document.getElementById("clearBtn");

let activeFilter = "all";               // "all", a family name, or "favourites"
let favourites = loadFavourites();      // list of card ids the user has hearted

// ---------- 2. Favourites (saved in the browser so they are still there next visit) ----------
function loadFavourites(){
  try {
    let saved = localStorage.getItem("worldnose-favourites");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];   // if the browser blocks storage the site still works, it just forgets
  }
}

function saveFavourites(){
  try {
    localStorage.setItem("worldnose-favourites", JSON.stringify(favourites));
  } catch (error) {
    console.log("Could not save favourites");
  }
}

function setHeart(button, isFavourite){
  let name = button.closest(".perfume-card").querySelector(".p-title").textContent;
  button.setAttribute("aria-pressed", isFavourite);
  button.setAttribute("aria-label", (isFavourite ? "Remove " : "Save ") + name + (isFavourite ? " from favourites" : " to favourites"));
}

// ---------- 3. Work out which cards match ----------
function cardMatches(card){
  let notes = card.dataset.notes.toLowerCase();
  let creator = card.dataset.creator.toLowerCase();
  let date = card.dataset.date.toLowerCase();

  // notes: every word the person types must be one of the notes (so "vanilla amber" needs both)
  let wanted = notesBox.value.toLowerCase().split(/[\s,]+/).filter(Boolean);
  let notesOk = wanted.every(function(word){ return notes.includes(word); });

  let creatorOk = creator.includes(creatorBox.value.trim().toLowerCase());
  let dateOk = date.includes(dateBox.value.trim().toLowerCase());

  let chipOk = true;
  if (activeFilter === "favourites"){
    chipOk = favourites.includes(card.dataset.id);
  } else if (activeFilter !== "all"){
    chipOk = card.dataset.family === activeFilter;
  }
  return notesOk && creatorOk && dateOk && chipOk;
}

function updateResults(){
  let shown = 0;
  cards.forEach(function(card){
    let match = cardMatches(card);
    card.hidden = !match;
    if (match){ shown++; }
  });

  countText.textContent = "Showing " + shown + " of " + cards.length + " fragrances";
  emptyMsg.hidden = shown !== 0;
  if (shown === 0){
    emptyMsg.textContent = activeFilter === "favourites" && !notesBox.value && !creatorBox.value && !dateBox.value
      ? "No favourites yet. Tap Save on a fragrance and it will show up here."
      : "No fragrances match that search. Try a different note or clear the search.";
  }
}

// ---------- 4. Wire everything up ----------
function setFilter(name){
  activeFilter = name;
  chips.forEach(function(chip){
    chip.setAttribute("aria-pressed", chip.dataset.filter === name);
  });
  updateResults();
}

chips.forEach(function(chip){
  chip.addEventListener("click", function(){ setFilter(chip.dataset.filter); });
});

[notesBox, creatorBox, dateBox].forEach(function(box){
  box.addEventListener("input", updateResults);       // search as you type
});

searchForm.addEventListener("submit", function(event){
  event.preventDefault();      // stop the page reloading, the search already ran
  updateResults();
});

clearBtn.addEventListener("click", function(){
  notesBox.value = "";
  creatorBox.value = "";
  dateBox.value = "";
  setFilter("all");
});

document.querySelectorAll(".p-heart").forEach(function(button){
  let id = button.closest(".perfume-card").dataset.id;
  setHeart(button, favourites.includes(id));           // show hearts that were saved before

  button.addEventListener("click", function(){
    if (favourites.includes(id)){
      favourites = favourites.filter(function(item){ return item !== id; });
    } else {
      favourites.push(id);
    }
    saveFavourites();
    setHeart(button, favourites.includes(id));
    if (activeFilter === "favourites"){ updateResults(); }
  });
});

// ---------- 5. Scent family cards on the Home page link here like fragrances.html?family=floral ----------
let wantedFamily = new URLSearchParams(window.location.search).get("family");
let familyExists = Array.from(chips).some(function(chip){ return chip.dataset.filter === wantedFamily; });
setFilter(familyExists ? wantedFamily : "all");    // ignore anything odd in the address bar
