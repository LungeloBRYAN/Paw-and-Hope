/* ===================================================================
   Paws & Hope — services.js (Services page only)

   1. Animals list: built from the ANIMALS data, with search, filter, sort
   2. Outreach table: shows only the events that have not passed yet
   =================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Animals list ---------- */
  const animalGrid = document.getElementById("animal-grid");

  if (animalGrid) {
    const filterForm = document.getElementById("animal-filters");
    const searchInput = document.getElementById("animal-search");
    const speciesSelect = document.getElementById("species-filter");
    const availableOnly = document.getElementById("available-only");
    const sortSelect = document.getElementById("sort-by");
    const resultsCount = document.getElementById("results-count");
    const emptyMessage = document.getElementById("no-results");

    // Each sort option says how to compare two animals
    const sorters = {
      "name":     function (a, b) { return a.name.localeCompare(b.name); },
      "age-asc":  function (a, b) { return a.ageMonths - b.ageMonths; },
      "age-desc": function (a, b) { return b.ageMonths - a.ageMonths; },
      "fee-asc":  function (a, b) { return a.fee - b.fee; }
    };

    // Work out which animals match what the visitor has typed/chosen
    function getMatchingAnimals() {
      const searchText = searchInput.value.trim().toLowerCase();

      const matches = ANIMALS.filter(function (animal) {
        if (speciesSelect.value !== "all" && animal.species !== speciesSelect.value) {
          return false;
        }
        if (availableOnly.checked && animal.status !== "Available") {
          return false;
        }
        if (searchText !== "") {
          // Search the name, species, breed, description and traits together
          const searchableText = [animal.name, animal.species, animal.breed, animal.bio, animal.traits.join(" ")]
            .join(" ")
            .toLowerCase();
          if (!searchableText.includes(searchText)) {
            return false;
          }
        }
        return true;
      });

      matches.sort(sorters[sortSelect.value]);
      return matches;
    }

    // Build one animal card
    function buildCard(animal) {
      const card = el("article", { class: "card animal-card" });

      card.appendChild(el("img", { src: animal.image, alt: animal.alt, width: "400", height: "400", loading: "lazy" }));
      card.appendChild(el("h3", { text: animal.name }));
      card.appendChild(el("p", { class: "meta", text: animal.breed + " \u00b7 " + formatAge(animal.ageMonths) + " \u00b7 " + animal.sex }));
      card.appendChild(el("p", { class: "badge badge-" + animal.status.toLowerCase(), text: animal.status }));
      card.appendChild(el("p", { text: animal.bio }));
      card.appendChild(el("p", { class: "fee", text: "Adoption fee: " + formatMoney(animal.fee) }));

      const actions = el("div", { class: "card-actions" }, [
        el("button", { type: "button", class: "btn btn-dark", "data-animal": animal.id, text: "Meet " + animal.name }),
        el("a", { class: "btn btn-outline-dark", href: "enquiry.html?type=adopt&animal=" + animal.id, text: "Enquire" })
      ]);
      card.appendChild(actions);

      return card;
    }

    // Redraw the list whenever the visitor changes something
    function showAnimals() {
      const matches = getMatchingAnimals();

      animalGrid.textContent = ""; // empty the grid, then add a card for each match
      matches.forEach(function (animal) {
        animalGrid.appendChild(buildCard(animal));
      });

      resultsCount.textContent = "Showing " + matches.length + " of " + ANIMALS.length + " animals";
      emptyMessage.hidden = matches.length !== 0;
    }

    searchInput.addEventListener("input", showAnimals);
    speciesSelect.addEventListener("change", showAnimals);
    availableOnly.addEventListener("change", showAnimals);
    sortSelect.addEventListener("change", showAnimals);

    // A reset button puts the controls back to normal, THEN we redraw
    filterForm.addEventListener("reset", function () {
      setTimeout(showAnimals, 0);
    });

    // The Search button (or pressing Enter in the search box) should update the list, not reload the page
    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      showAnimals();
    });

    showAnimals();
  }


  /* ---------- 2. Upcoming outreach days ---------- */
  const eventsBody = document.getElementById("events-body");

  if (eventsBody) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // midnight this morning, so today's event still counts

    const upcoming = OUTREACH_EVENTS
      .filter(function (event) {
        return new Date(event.date + "T00:00:00") >= today;
      })
      .sort(function (a, b) {
        return a.date.localeCompare(b.date);
      });

    eventsBody.textContent = "";

    if (upcoming.length === 0) {
      const cell = el("td", { colspan: "3", text: "No outreach days are scheduled right now. Please check back soon or contact us." });
      eventsBody.appendChild(el("tr", {}, [cell]));
    } else {
      upcoming.forEach(function (event) {
        eventsBody.appendChild(el("tr", {}, [
          el("th", { scope: "row", text: formatLongDate(event.date) }),
          el("td", { text: event.focus }),
          el("td", { text: event.location })
        ]));
      });
    }
  }

});
