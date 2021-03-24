// ---------- constant variables ----------------------------------------------

// search API URLs
const SHAPE_URL = "https://pokeapi.co/api/v2/pokemon-shape/";
const EGG_GROUP_URL = "https://pokeapi.co/api/v2/egg-group/";
const TYPE_URL = "https://pokeapi.co/api/v2/type/";
const INFO_URL = "https://pokeapi.co/api/v2/pokemon-species/";

const REGION_SPECIES_LIMITS = {
  kanto: [1, 151],
  johto: [152, 251],
  hoenn: [252, 386],
  sinnoh: [387, 493],
  unova: [494, 649],
  kalos: [650, 721],
  alola: [722, 809],
  galar: [810, 898],
};

const SHAPES = {
  ball: 1,
  squiggle: 2,
  fish: 3,
  arms: 4,
  blob: 5,
  upright: 6,
  legs: 7,
  quadruped: 8,
  wings: 9,
  tentacles: 10,
  heads: 11,
  humanoid: 12,
  bugWings: 13,
  armor: 14,
};

const EGG_GROUPS = {
  monster: 1,
  water1: 2,
  bug: 3,
  flying: 4,
  ground: 5,
  fairy: 6,
  plant: 7,
  humanshape: 8,
  water3: 9,
  mineral: 10,
  indeterminate: 11,
  water2: 12,
  ditto: 13,
  dragon: 14,
  noEggs: 15,
};

const TYPES = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
};

// ---------- state variables -------------------------------------------------

// state variables for search functionality
/*
  selectedSearch and searchCriterion will be the same in most cases, but will
    be different if user searches first, then chooses another category, and
    then reselects the region. searchCriterion is always tied to searchValue
    so the search requests will always be valid.
*/
let selectedRegion, selectedSearch, searchCriterion, searchValue;

// state variable for results of search
let results = [];

// state variable for Pokemon data to be displayed in modal
let pokemonData = {};

// ---------- cached element references ---------------------------------------

// elements used in search functionality
const $searchRegionEl = $("#search-region");
const $selectSearchEl = $("#select-search");
const $criterionSearchesEl = $("#criterion-searches");
const $searchShapeEl = $("#search-shape");
const $searchEggGroupEl = $("#search-egg-group");
const $searchTypeEl = $("#search-type");
const $selectableEl = $(".selectable");
const $hideableEl = $(".hideable");

// element used in results display
const $resultsEl = $("div#results");

// elements used in modal display
const $modalEl = $("#pokemon-info-modal");
const $modalTitleEl = $("#modal-title");
const $modalBodyHeaderTextEl = $("#modal-body-header-text");
const $modalBodyHeaderImgCtnrEl = $("#modal-body-header-image-container");
const $modalBodyTextEl = $("#modal-body-text");

// ---------- event listeners -------------------------------------------------

// the user's first step: to select a region to narrow search results
$searchRegionEl.on("click", ".dropdown-item", function () {
  activate($(this));
  selectedRegion = this.dataset.region;
  // allows user to select the search category next
  $selectSearchEl.children().eq(0).removeAttr("disabled");
  // if the user has already searched, then search again using existing choices
  if (selectedSearch) {
    handleSearch();
  }
});

// the user's second step: to select a search category
$selectSearchEl.on("click", ".dropdown-item", function () {
  activate($(this));
  $selectableEl.removeClass("selected");
  selectedSearch = this.dataset.search;
  // once a category (criterion) is chosen, then unhide only the next dropdown
  $hideableEl.hide();
  switch (selectedSearch) {
    case "shape":
      $searchShapeEl.show();
      break;
    case "egggroup":
      $searchEggGroupEl.show();
      break;
    case "type":
      $searchTypeEl.show();
      break;
  }
});

// the user's third step: to choose a value to search for
$criterionSearchesEl.on("click", "button.dropdown-item", function () {
  activate($(this));
  searchCriterion = this.dataset.criterion;
  searchValue = this.dataset.value;
  handleSearch();
});

// when the user clicks on a result card
$resultsEl.on("click", "article.pokemon", function () {
  let pokemonId = this.dataset.id;
  handleDisplayModal(pokemonId);
});

// ---------- functions -------------------------------------------------------

init();

function init() {
  $resultsEl.empty();
}

// changes "active" status when a choice is selected
function activate(element) {
  // changes the color of the chosen option within the dropdown bar
  element.siblings().removeClass("selected");
  element.addClass("selected");
  // changes the color of the dropdown bar button
  let parentButton = element.parent().siblings().eq(0);
  parentButton.text(element.text());
  parentButton.addClass("selected");
}

// search function - called when a search value is chosen
function handleSearch() {
  let searchUrl = generateSearchUrl();
  $.ajax(searchUrl).then(
    function (data) {
      switch (searchCriterion) {
        // searching by type returns data in a different format
        case "type":
          const typeSearchResults = data.pokemon;
          jsonPokemon = typeSearchResults.map(function (result) {
            return result.pokemon;
          });
          break;
        // otherwise, just get the data as normal
        case "shape":
        case "egggroup":
          jsonPokemon = data.pokemon_species;
      }
      // then narrow results by region and display 
      results = refineResults(jsonPokemon);
      render(results);
    },
    function (error) {
      console.log(error);
    }
  );
}

// generates an API URL for the search based on the category
function generateSearchUrl() {
  switch (searchCriterion) {
    case "shape":
      return SHAPE_URL + searchValue;
    case "egggroup":
      return EGG_GROUP_URL + searchValue;
    case "type":
      return TYPE_URL + searchValue;
  }
}

// narrows the results based on selected region to limit data displayed on page
function refineResults(results) {
  let refinedResults = results.filter(function (pokemon) {
    let pokemonId = getPokeId(pokemon);
    return inRegion(pokemonId, selectedRegion);
  });
  return refinedResults;
}

// grabs Pokemon id number from the Pokemon object in results
function getPokeId(pokemon) {
  let splitUrl = pokemon.url.split("/");
  return parseInt(splitUrl.slice(-2, -1));
}

// checks if a Pokemon's number lies within a region's number limits
function inRegion(id, region) {
  let min = REGION_SPECIES_LIMITS[region][0];
  let max = REGION_SPECIES_LIMITS[region][1];
  return min <= id && id <= max;
}

function capitalize(lowercaseName) {
  return lowercaseName[0].toUpperCase() + lowercaseName.slice(1);
}

// displays results onto page
function render(results) {
  // clear the page first
  $resultsEl.empty();

  // generate html for a card for each result
  const html = results.map(function (pokemon) {
    let pokemonId = getPokeId(pokemon);
    let pokemonName = pokemon.name;
    let uppercaseName = capitalize(pokemonName);
    return `
      <article 
        class="pokemon card text-center" 
        data-id="${pokemonId}"
      >
        <div class="img-container">
          <img src="img/sprites/${pokemonId}.png"
            class="card-img-top pk-icon" alt="${uppercaseName}">
        </div>
        <div class="card-body">
          <h5 class="card-title">${uppercaseName}</h5>
        </div>
      </article>
      `;
  });
  $resultsEl.append(html);

  // if no results, then display an error message
  if (!html.length) {
    let searchCriterionErr = searchCriterion;
    if (searchCriterion === "egggroup") searchCriterionErr = "egg group";
    $resultsEl.append(`
      <p>
        No Pok&eacute;mon of the
          <span class="bold">
            ${capitalize(searchValue)} ${searchCriterionErr}
          </span>
        found in the 
        <span class="bold">
            ${capitalize(selectedRegion)}
        </span>
        region.
      </p>`
    );
  }
}

// display modal function - called when a card is clicked
function handleDisplayModal(id) {
  // clear modal of text and images
  $modalBodyHeaderTextEl.empty();
  $modalBodyHeaderImgCtnrEl.empty();
  $modalBodyTextEl.empty();
  // open the modal
  $modalEl.modal("toggle");
  $.ajax(INFO_URL + id).then(
    function (data) {
      loadPokeData(data);
      renderModal(pokemonData);
    },
    function (error) {
      console.log(error);
    }
  );
}

// parses relevant data (in English) and store in object to display in modal
function loadPokeData(pokemon) {
  // load id
  pokemonData.id = pokemon.pokedex_numbers[0].entry_number;

  // load name
  let nameEng = pokemon.names.find(function (nameEntry) {
    return nameEntry.language.name === "en";
  });
  pokemonData.name = nameEng.name;

  // load color
  pokemonData.color = pokemon.color.name;

  // load egg group
  pokemonData.eggGroup = pokemon.egg_groups.map(function (groupEntry) {
    return groupEntry.name;
  });

  // load genus
  let genusEng = pokemon.genera.find(function (genusEntry) {
    return genusEntry.language.name === "en";
  });
  pokemonData.genus = genusEng.genus;

  // load shape
  pokemonData.shape = pokemon.shape.name;

  // load all Pokemon flavor text descriptions from all games
  let flavorEng = pokemon.flavor_text_entries.filter(function (flavorEntry) {
    return flavorEntry.language.name === "en";
  });

  pokemonData.flavor = flavorEng.map(function (flavorEntry) {
    return [flavorEntry.version.name, flavorEntry.flavor_text];
  });
}

// displays Pokemon info in modal
function renderModal(pokemon) {
  // Pokemon can have multiple egg groups, so put them in a string
  let eggGroups = pokemon.eggGroup.join(", ");
  if (!eggGroups) eggGroups = "none";

  $modalTitleEl.text(`#${pokemon.id}: ${pokemon.name}`);

  let modalBodyHeaderTextHtml = `
      <h5>${pokemon.genus}</h5>
      <p><span class="bold">Body shape:</span> ${pokemon.shape}</p>
      <p><span class="bold">Egg groups:</span> ${eggGroups}</p>
      <p><span class="bold">Main color:</span> ${pokemon.color}</p>
    `;
  $modalBodyHeaderTextEl.append(modalBodyHeaderTextHtml);

  let modalBodyHeaderImgHtml = `<img src="img/portraits/${pokemon.id}.png"
    class="card-img-top pk-portrait" alt="${pokemon.name}">`;
  $modalBodyHeaderImgCtnrEl.append(modalBodyHeaderImgHtml);

  $modalBodyTextEl.append(
    "<h5 class='underline'>Pok&eacute;mon description by game version:</h5>"
  );
  let flavorEntries = pokemon.flavor.map(function (entry) {
    return `<p>
              <span class="bold">
                ${capitalize(entry[0])} Version:
              </span>
              ${entry[1]}
            </p>`;
  });
  $modalBodyTextEl.append(flavorEntries);
}
