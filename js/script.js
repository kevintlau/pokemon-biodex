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
  selectedShape,
  selectedEggGroup,
  selectedType;

// ---------- cached element references ---------------------------------------

const $results = $("div.results");
const $searchRegion = $("#search-region");
const $selectSearch = $("#select-search");
const $searchShape = $("#search-shape");
const $searchEggGroup = $("#search-egg-group");
const $searchType = $("#search-type");

// ---------- event listeners -------------------------------------------------

$searchRegion.on("click", ".dropdown-item", function () {
  selectedRegion = this.dataset.region;
});

$searchShape.on("click", "button.dropdown-item", handleSearchShape);

// ---------- functions -------------------------------------------------------

// init();

// function init() {

// }

function handleSearchShape() {
  const selectedShape = this.dataset.shape;
  const shapeId = SHAPES[selectedShape];
  displayResults(SHAPE_URL, shapeId);

}

function displayResults(searchUrl, searchCode) {
  $.ajax(searchUrl + searchCode).then(
    function(data) {
      results = refineResults(data.pokemon_species)
      render(results);
    },
    function(error) {
      console.log(error)
    }
  );
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

function refineResults(results) {
  let refinedResults = results.filter(function(pokemon) {
    let pokemonId = getPokeId(pokemon)
    return inRegion(pokemonId);
  });
  console.log(refinedResults);
  return refinedResults;
}

function render(results) {
  const html = results.map(function(pokemon) {
    pokeId = getPokeId(pokemon);
    pokeName = getPokeName(pokemon);
    return `
      <article class="card">
      <p class="pk-number">${pokeId}</p>
      <p class="pk-name">${pokeName}</p>
      <img class="pk-image" 
        src="https://bulbapedia.bulbagarden.net/wiki/File:"${pokeId}${pokeName}.png" 
        alt="#" />
      </article>
      `;
  });
  $results.append(html);
}

/* Tasks
1. implement searches by region
2. implement searches by shape, egg group, type
3. search one criterion at a time
    a. hide the other dropdowns unless the user chooses that criterion
4. make a modal card with the following
    a. number
    b. name
    c. type
    d. genus
    e. height
    f. weight
    g. dex entries from main series games
    h. picture
*/
