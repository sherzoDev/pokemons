const elSearchForm = document.querySelector(".js-hero-search-form");
const elSearchName = elSearchForm.querySelector(".js-search");
const elSelectWeaknesses = elSearchForm.querySelector(".js-select-weaknesses");
const elSearchFromCandyCount = elSearchForm.querySelector(".js-from-candy-count");
const elSearchToCandyCount = elSearchForm.querySelector(".js-to-candy-count");
const elSortBy = elSearchForm.querySelector(".js-sort");

// POKEMON LISTS
const elPokemonList = document.querySelector(".js-pokemon-list");
const elFavoritsList = document.querySelector(".js-favorites-list")


// FAVORITES
const favotitesPokemons = [];
const favoritesIndex = [];

function renderPokemons(arr, regex = "") {
    elPokemonList.innerHTML = null;

    const elPokemonTemp = document.querySelector(".js-pokemon-template").content;
    const elPokemonFragment = new DocumentFragment();
    arr.forEach(item => {
        const elClonePokemonTemp = elPokemonTemp.cloneNode(true);
        if (favoritesIndex.includes(String(item.id))) {
            elClonePokemonTemp.querySelector(".js-pokemon-bookmark-star").classList.add("is-favorite");
        }
        elClonePokemonTemp.querySelector(".js-pokemon-bookmark-star").dataset.id = item.id;
        elClonePokemonTemp.querySelector(".js-pokemon-img").src = item.img;
        elClonePokemonTemp.querySelector(".js-pokemon-img").alt = item.name;
        elClonePokemonTemp.querySelector(".js-pokemon-id").textContent = item.id;

        if (regex.source != "(?:)" && regex) {
            elClonePokemonTemp.querySelector(".js-pokemon-name").innerHTML = "Name: " + item.name.replace(regex,
                `<mark class="bg-danger">${regex.source.toLowerCase()}</mark>`
            );
        } else {
            elClonePokemonTemp.querySelector(".js-pokemon-name").textContent = `Name: ${item.name}`;
        }

        elClonePokemonTemp.querySelector(".js-pokemon-time").datetime = `2022-11-05 ${item.spawn_time}`;
        elClonePokemonTemp.querySelector(".js-pokemon-time").textContent = item.spawn_time;
        elClonePokemonTemp.querySelector(".js-pokemon-type").innerHTML = `<strong class="me-2">Type:</strong> ${item.type.join(" ")}`
        elClonePokemonTemp.querySelector(".js-pokemon-candy-count").innerHTML = `<strong class="me-2">Candy Count:</strong> ${item.candy_count}`;
        elClonePokemonTemp.querySelector(".js-pokemon-weight").innerHTML = `<strong class="me-1">Weight:</strong> ${item.weight}`;
        elClonePokemonTemp.querySelector(".js-pokemon-weaknesses").innerHTML = `<strong class="me-1">Weaknesses:</strong> ${item.weaknesses.join(" ")}`;

        elPokemonFragment.appendChild(elClonePokemonTemp);
    });
    elPokemonList.appendChild(elPokemonFragment);
};

function rederFavorutesPokemons() {
    elFavoritsList.innerHTML = null;

    const elPokemonTemp = document.querySelector(".js-pokemon-template").content;
    const elPokemonFragment = new DocumentFragment();
    favotitesPokemons.forEach(item => {
        const elClonePokemonTemp = elPokemonTemp.cloneNode(true);

        elClonePokemonTemp.querySelector(".js-pokemon-item").classList.remove("col-4");
        elClonePokemonTemp.querySelector(".js-pokemon-bookmark-star").classList.add("pokemon-bookmark-star-delete");
        elClonePokemonTemp.querySelector(".js-pokemon-bookmark-star").dataset.id = item.id;
        elClonePokemonTemp.querySelector(".js-pokemon-img").src = item.img;
        elClonePokemonTemp.querySelector(".js-pokemon-img").alt = item.name;
        elClonePokemonTemp.querySelector(".js-pokemon-id").textContent = item.id;
        elClonePokemonTemp.querySelector(".js-pokemon-name").textContent = `Name: ${item.name}`;
        elClonePokemonTemp.querySelector(".js-pokemon-time").textContent = item.spawn_time;
        elClonePokemonTemp.querySelector(".js-pokemon-time").datetime = `2022-11-05 ${item.spawn_time}`;
        elClonePokemonTemp.querySelector(".js-pokemon-type").innerHTML = `<strong class="me-2">Type:</strong> ${item.type.join(" ")}`
        elClonePokemonTemp.querySelector(".js-pokemon-candy-count").innerHTML = `<strong class="me-2">Candy Count:</strong> ${item.candy_count}`;
        elClonePokemonTemp.querySelector(".js-pokemon-weight").innerHTML = `<strong class="me-1">Weight:</strong> ${item.weight}`;
        elClonePokemonTemp.querySelector(".js-pokemon-weaknesses").innerHTML = `<strong class="me-1">Weaknesses:</strong> ${item.weaknesses.join(" ")}`;

        elPokemonFragment.appendChild(elClonePokemonTemp);
    });
    elFavoritsList.appendChild(elPokemonFragment);
};

function addWeaknesses() {
    const weeknessesSet = new Set();

    pokemons.forEach(item => {
        item.weaknesses.forEach(element => {
            weeknessesSet.add(element)
        });
    });

    const arr = Array.from(weeknessesSet)

    arr.sort((a, b) => a.toLowerCase().charCodeAt(0) - b.toLowerCase().charCodeAt(0))

    const elWeaknessesFragment = new DocumentFragment()
    arr.forEach(item => {
        const Option = document.createElement("option");
        Option.textContent = item;
        Option.value = item;

        elWeaknessesFragment.appendChild(Option);
    });

    elSelectWeaknesses.appendChild(elWeaknessesFragment);
};

function SortArray(arr, sortValue) {
    if (sortValue == "a-z") {
        arr.sort((a, b) => a.name.toLowerCase().charCodeAt(0) - b.name.toLowerCase().charCodeAt(0))
    }
    if (sortValue == "z-a") {
        arr.sort((a, b) => b.name.toLowerCase().charCodeAt(0) - a.name.toLowerCase().charCodeAt(0))
    }
    if (sortValue == "light-to-heavy") {
        arr.sort((a, b) => a.weight.split(" ")[0] - b.weight.split(" ")[0])
    }
    if (sortValue == "heavy-to-light") {
        arr.sort((a, b) => b.weight.split(" ")[0] - a.weight.split(" ")[0])
    }
};

elSearchForm.addEventListener("submit", function (evt) {
    evt.preventDefault();

    const elRegexSearch = new RegExp(elSearchName.value.trim(), "gi");

    const elSearch = pokemons.filter(element => element.name.match(elRegexSearch) && (elSelectWeaknesses.value == "weaknesses" || element.weaknesses.includes(elSelectWeaknesses.value)) && (elSearchFromCandyCount.value == "" || Number(elSearchFromCandyCount.value) <= element.candy_count) && (elSearchToCandyCount.value == "" || Number(elSearchToCandyCount.value) >= element.candy_count));

    if (elSearch.length > 0) {
        SortArray(elSearch, elSortBy.value)
        renderPokemons(elSearch, elRegexSearch)
    } else {
        elPokemonList.innerHTML = null;
        const item = document.createElement("li");
        const text = document.createElement("h3");
        text.classList.add("text-white");
        text.textContent = "Not Found"

        item.appendChild(text);
        elPokemonList.appendChild(item)
    }

});

elPokemonList.addEventListener("click", function (evt) {
    if (favoritesIndex.includes(evt.target.dataset.id)) {
        evt.target.classList.remove("is-favorite");
        const delObgIndex = favoritesIndex.findIndex(item => item == evt.target.dataset.id);
        favotitesPokemons.splice(delObgIndex, 1);
        favoritesIndex.splice(delObgIndex, 1);
        rederFavorutesPokemons()
    } else if (evt.target.matches(".pokemon-bookmark-star")) {
        const obj = pokemons.find(item => item.id == evt.target.dataset.id);
        if (!favotitesPokemons.includes(obj)) {
            favotitesPokemons.unshift(obj);
            favoritesIndex.unshift(evt.target.dataset.id);
            rederFavorutesPokemons()
        }
        evt.target.classList.add("is-favorite");
    }
});

elFavoritsList.addEventListener("click", function (evt) {
    if (evt.target.matches(".pokemon-bookmark-star-delete")) {
        const objIndex = favotitesPokemons.findIndex(item => item.id == evt.target.dataset.id);
        favotitesPokemons.splice(objIndex, 1);
        favoritesIndex.splice(objIndex, 1);
        rederFavorutesPokemons()
        renderPokemons(pokemons)
    }
});

addWeaknesses()
renderPokemons(pokemons.slice(0, 100))