/* ===================================================================
   Paws & Hope — map.js (Contact page)

   An interactive map built with Leaflet (https://leafletjs.com), a free
   open-source map library. The map pictures ("tiles") come from
   OpenStreetMap. The page loads Leaflet (the global "L") before this file.

   What it does:
     - shows both locations as markers, each with a popup
     - "Show on map" buttons zoom in to one location
     - "Show both" zooms out to fit both markers
     - "Find the closest to me" uses the visitor's location (only after
       they press the button and allow it)

   The coordinates are the approximate centres of the suburbs (the street
   address on the site is a made-up example).
   =================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const mapBox = document.getElementById("map");
  if (!mapBox) {
    return; // this page has no map
  }

  const status = document.getElementById("map-status");

  // If Leaflet could not load (for example, no internet), say so instead of leaving a blank box
  if (typeof L === "undefined") {
    mapBox.textContent = "The interactive map could not load. Please use the addresses and opening hours listed on this page.";
    mapBox.classList.add("map-unavailable");
    return;
  }

  const LOCATIONS = [
    {
      id: "shelter",
      name: "Main Shelter",
      lat: -26.04861,
      lng: 28.03389,
      address: "142 Bryanston Drive, Bryanston, Johannesburg, 2191",
      hours: "Mon\u2013Fri 09:00\u201317:00, Sat 09:00\u201314:00"
    },
    {
      id: "adoption-day",
      name: "Mobile Adoption Day",
      lat: -26.10383,
      lng: 28.09617,
      address: "Alexandra Community Hall, Alexandra, Johannesburg",
      hours: "First Sunday of every month, 09:00\u201313:00"
    }
  ];

  // ----- Create the map -----
  const map = L.map("map", { scrollWheelZoom: false }); // scroll-zoom off so the page can still scroll past the map

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Turn scroll-zoom on after the visitor clicks the map, and off when the mouse leaves
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });

  // ----- Add a marker and popup for each location -----
  const markers = {};

  LOCATIONS.forEach(function (place) {
    // The popup is built from elements (not an HTML string), which keeps it safe and easy to read
    const directions = el("a", {
      href: "https://www.google.com/maps/dir/?api=1&destination=" + place.lat + "," + place.lng,
      target: "_blank",
      rel: "noopener noreferrer",
      text: "Get directions"
    });

    const popup = el("div", { class: "map-popup" }, [
      el("strong", { text: place.name }),
      el("br"),
      document.createTextNode(place.address),
      el("br"),
      document.createTextNode(place.hours),
      el("br"),
      directions
    ]);

    markers[place.id] = L.marker([place.lat, place.lng], { title: place.name, alt: place.name + " on the map" })
      .addTo(map)
      .bindPopup(popup);
  });

  // ----- Zoom to fit both markers -----
  function showBoth() {
    const points = LOCATIONS.map(function (place) { return [place.lat, place.lng]; });
    map.fitBounds(points, { padding: [50, 50] });
  }

  // ----- Zoom in on one marker and open its popup -----
  function showLocation(id) {
    const place = LOCATIONS.find(function (item) { return item.id === id; });
    map.flyTo([place.lat, place.lng], 15, { duration: 1.2 });
    map.once("moveend", function () {
      markers[id].openPopup();
    });
  }

  showBoth();

  // ----- Buttons next to the map -----
  document.querySelectorAll("[data-location]").forEach(function (button) {
    button.addEventListener("click", function () {
      showLocation(button.dataset.location);
    });
  });

  const showBothButton = document.getElementById("map-show-both");
  if (showBothButton) {
    showBothButton.addEventListener("click", showBoth);
  }

  // ----- "Find the closest to me" -----
  const nearestButton = document.getElementById("map-nearest");

  if (nearestButton) {
    nearestButton.addEventListener("click", function () {
      if (!("geolocation" in navigator)) {
        status.textContent = "Your browser cannot share your location, so we cannot work out which is closest.";
        return;
      }

      status.textContent = "Finding your location\u2026";

      navigator.geolocation.getCurrentPosition(
        function (position) {
          const you = L.latLng(position.coords.latitude, position.coords.longitude);

          // Measure the distance (in metres) from the visitor to each location and keep the smallest
          let closest = null;
          let closestDistance = Infinity;
          LOCATIONS.forEach(function (place) {
            const distance = map.distance(you, L.latLng(place.lat, place.lng));
            if (distance < closestDistance) {
              closest = place;
              closestDistance = distance;
            }
          });

          status.textContent = "Closest to you: " + closest.name + ", about " + (closestDistance / 1000).toFixed(1) + " km away.";
          showLocation(closest.id);
        },
        function (error) {
          // error.code: 1 = permission denied, 2 = position unavailable, 3 = timed out
          if (error.code === 1) {
            status.textContent = "Location sharing was blocked. You can still use the buttons above to see each place on the map.";
          } else if (error.code === 3) {
            status.textContent = "Finding your location took too long. Please try again.";
          } else {
            status.textContent = "We could not find your location. Please try again or use the buttons above.";
          }
        },
        { timeout: 10000 }
      );
    });
  }

});
