// ---------- constant variables ----------------------------------------------

const SHAPE_URL = "https://pokeapi.co/api/v2/pokemon-shape/";
const EGG_GROUP_URL = "https://pokeapi.co/api/v2/egg-group/";
const TYPE_URL = "https://pokeapi.co/api/v2/type/";
const DESC_URL = "https://pokeapi.co/api/v2/pokemon-species/";

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

let results, 
    selectedRegion, 
    selectedSearch, 
    searchCriterion, 
    searchValue;

// ---------- cached element references ---------------------------------------

const $resultsEl = $("div#results");
const $searchRegionEl = $("#search-region");
const $selectSearchEl = $("#select-search");
const $searchShapeEl = $("#search-shape");
const $searchEggGroupEl = $("#search-egg-group");
const $searchTypeEl = $("#search-type");
const $hideableEl = $(".hideable");
const $criterionSearchesEl = $("#criterion-searches");

// ---------- event listeners -------------------------------------------------

$searchRegionEl.on("click", ".dropdown-item", function () {
  activate($(this));
  selectedRegion = this.dataset.region;
  $selectSearchEl.children().eq(0).removeAttr("disabled");
  if (selectedSearch) {
    handleSearch();
  }
});

$selectSearchEl.on("click", ".dropdown-item", function () {
  activate($(this));
  selectedSearch = this.dataset.search;
  $criterionSearchesEl.empty();
  switch (selectedSearch) {
    case "shape":
      createShapeSearch();
      break;
    case "egggroup":
      createEggGroupSearch();
      break;
    case "type":
      createTypeSearch();
      break;
  }
});

$criterionSearchesEl.on("click", "button.dropdown-item", function () {
  activate($(this));
  searchCriterion = this.dataset.criterion;
  searchValue = this.dataset.value;
  handleSearch();
});

// ---------- functions -------------------------------------------------------

init();

function init() {
  $resultsEl.empty();
  $criterionSearchesEl.empty();
}

// Create Bootstrap dropdown for body shape search
function createShapeSearch() {
  $criterionSearchesEl.empty();
  const shapeSearchHtml = `
    <div class="dropdown" id="search-shape">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Select a shape
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="wings"
        >
          Alar (characterized by two wings)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="blob"
        >
          Alvine (indescribable)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="humanoid"
        >
          Anthropomorphic (human-like)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="arms"
        >
          Brachial (characterized by arms)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="squiggle"
        >
          Caudal (squiggly / snakelike)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="armor"
        >
          Chitinous (plated / armored)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="tentacles"
        >
          Cilial (characterized by tentacles)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="legs"
        >
          Crural (characterized by legs)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="fish"
        >
          Ichthyic (fishlike / finned)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="bug-wings"
        >
          Lepidopterous (multi-winged)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="quadruped"
        >
          Mensal (quadrupedal)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="heads"
        >
          Polycephalic (multi-headed)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="ball"
        >
          Pomaceous (spherical / orblike)
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="shape"
          data-value="upright"
        >
          Sciurine (bipedal)
        </button>
      </div>
    </div>
    `;
  $criterionSearchesEl.append(shapeSearchHtml);
}

// Create Bootstrap dropdown for egg group search
function createEggGroupSearch() {
  $criterionSearchesEl.empty();
  const eggGroupSearchHtml = `
    <div class="dropdown" id="search-egg-group">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Select an egg group
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="bug"
        >
          Bug
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="dragon"
        >
          Dragon
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="fairy"
        >
          Fairy
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="flying"
        >
          Flying
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="ground"
        >
          Ground
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="humanshape"
        >
          Humanshape
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="indeterminate"
        >
          Indeterminate
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="mineral"
        >
          Mineral
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="monster"
        >
          Monster
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="plant"
        >
          Plant
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="water1"
        >
          Water, type 1
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="water2"
        >
          Water, type 2
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="water3"
        >
          Water, type 3
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="ditto"
        >
          Ditto
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="egggroup"
          data-value="no-eggs"
        >
          Cannot breed
        </button>
      </div>
    </div>
    `;
  $criterionSearchesEl.append(eggGroupSearchHtml);
}

// Create Bootstrap dropdown for type search
function createTypeSearch() {
  $criterionSearchesEl.empty();
  const typeSearchHtml = `
    <div class="dropdown hideable" id="search-type">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Select a type
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="bug"
        >
          Bug
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="dark"
        >
          Dark
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="dragon"
        >
          Dragon
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="electric"
        >
          Electric
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="fairy"
        >
          Fairy
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="fighting"
        >
          Fighting
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="fire"
        >
          Fire
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="flying"
        >
          Flying
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="ghost"
        >
          Ghost
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="grass"
        >
          Grass
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="ground"
        >
          Ground
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="ice"
        >
          Ice
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="normal"
        >
          Normal
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="poison"
        >
          Poison
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="psychic"
        >
          Psychic
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="rock"
        >
          Rock
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="steel"
        >
          Steel
        </button>
        <button
          class="dropdown-item"
          type="button"
          data-criterion="type"
          data-value="water"
        >
          Water
        </button>
      </div>
    </div>
    `;
  $criterionSearchesEl.append(typeSearchHtml);
}

function activate(element) {
  element.siblings().removeClass("selected");
  element.addClass("selected");
  let parentButton = element.parent().siblings().eq(0);
  parentButton.text(element.text());
  parentButton.addClass("selected");
}

function handleSearch() {
  if (searchCriterion === "shape") {
    displayResults(SHAPE_URL, searchValue, searchCriterion);
  } else if (searchCriterion === "egggroup") {
    displayResults(EGG_GROUP_URL, searchValue, searchCriterion);
  } else if (searchCriterion === "type") {
    displayResults(TYPE_URL, searchValue, searchCriterion);
  } else {
    console.log("Search criterion could not be read.");
  }
}

function displayResults(searchUrl, searchValue, searchCriterion) {
  $.ajax(searchUrl + searchValue).then(
    function (data) {
      switch (searchCriterion) {
        case "type":
          const typeSearchResults = data.pokemon;
          jsonPokemon = typeSearchResults.map(function (result) {
            return result.pokemon;
          });
          break;
        case "shape":
        case "egggroup":
          jsonPokemon = data.pokemon_species;
          break;
      }
      results = refineResults(jsonPokemon);
      render(results);
    },
    function (error) {
      console.log(error);
    }
  );
}

function refineResults(results) {
  let refinedResults = results.filter(function (pokemon) {
    let pokemonId = getPokeId(pokemon);
    return inRegion(pokemonId);
  });
  return refinedResults;
}

function getPokeId(pokemon) {
  let splitUrl = pokemon.url.split("/");
  return parseInt(splitUrl.slice(-2, -1));
}

function getPokeName(pokemon) {
  let lowercaseName = pokemon.name;
  return lowercaseName[0].toUpperCase() + lowercaseName.slice(1);
}

function inRegion(num) {
  let min = REGION_SPECIES_LIMITS[selectedRegion][0];
  let max = REGION_SPECIES_LIMITS[selectedRegion][1];
  return min <= num && num <= max;
}

function render(results) {
  $resultsEl.empty();
  const html = results.map(function (pokemon) {
    pokeId = getPokeId(pokemon);
    pokeName = getPokeName(pokemon);
    return `
      <article class="pokemon card text-center">
        <div class="img-container">
          <img src="https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg"
            class="card-img-top pk-img" alt="${pokeName}">
        </div>
        <div class="card-body">
          <h5 class="card-title">#${pokeId}: ${pokeName}</p>
        </div>
      </article>
      `;
  });
  $resultsEl.append(html);
  if (!html.length) {
    $resultsEl.append("<p class='no-results'>No results found.</p>");
  }
}
