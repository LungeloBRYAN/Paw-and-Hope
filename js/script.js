/* ===================================================================
   Paws & Hope Animal Rescue — shared JavaScript (Part 3)
   Loaded on EVERY page. It contains:
     1. el()          a small helper for building page elements safely
     2. trapFocus()   keeps the keyboard inside a pop-up while it is open
     3. Mobile menu   the "Menu" button on small screens
     4. Stat counters the numbers on the homepage count up once
     5. Accordion     the FAQ on the Services page
     6. Animal modal  the "Meet Buddy" pop-up (homepage and Services page)

   Page-specific code lives in other files:
     services.js  animals list with search/filter/sort + upcoming events
     lightbox.js  gallery lightbox on the About page
     map.js       interactive map on the Contact page
     forms.js     validation + responses for the Enquiry and Contact forms
   =================================================================== */


/* ---------- 1. Helper: build an element without writing HTML strings ----------
   Example: el("p", { class: "meta", text: "Hello" })
   "text" is set with textContent, which treats everything as plain text.
   That matters for security: if a visitor types <script> into a form, it is
   shown as harmless text instead of being run as code (this is how
   cross-site scripting attacks are prevented). */
function el(tag, attrs, children) {
  const node = document.createElement(tag);
  const settings = attrs || {};

  Object.keys(settings).forEach(function (key) {
    if (key === "text") {
      node.textContent = settings[key];
    } else if (key === "class") {
      node.className = settings[key];
    } else {
      node.setAttribute(key, settings[key]);
    }
  });

  (children || []).forEach(function (child) {
    node.appendChild(child);
  });

  return node;
}


/* ---------- 2. Keep keyboard focus inside a pop-up ----------
   Call this from a keydown handler when the Tab key is pressed. When the
   user tabs past the last button, focus jumps back to the first one. */
function trapFocus(container, event) {
  const focusable = container.querySelectorAll("a[href], button:not([disabled])");
  if (focusable.length === 0) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}


document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 3. Mobile menu ----------
     On small screens the menu links are hidden until the Menu button is
     pressed. aria-expanded tells screen readers whether the menu is open. */
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Pressing Escape closes the menu again
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }


  /* ---------- 4. Stat counters ----------
     The real numbers are already written in the HTML (so search engines and
     people with JavaScript off still see them). When the stats scroll into
     view, this counts up from 0 to the number in data-count, one time. */
  const counters = document.querySelectorAll("[data-count]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(node) {
    const target = Number(node.dataset.count);
    const suffix = node.dataset.suffix || "";
    const duration = 1400; // milliseconds
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // starts fast, slows down at the end
      node.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  if (counters.length > 0 && !prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target); // only count once
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }


  /* ---------- 5. Accordion (FAQ) ----------
     Each question is a button. Its aria-controls points at the answer panel.
     Opening one question closes the others. */
  function openQuestion(button) {
    button.setAttribute("aria-expanded", "true");
    document.getElementById(button.getAttribute("aria-controls")).classList.add("is-open");
  }

  function closeQuestion(button) {
    button.setAttribute("aria-expanded", "false");
    document.getElementById(button.getAttribute("aria-controls")).classList.remove("is-open");
  }

  document.querySelectorAll(".accordion").forEach(function (accordion) {
    const buttons = Array.from(accordion.querySelectorAll(".accordion-trigger"));

    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        const wasOpen = button.getAttribute("aria-expanded") === "true";
        buttons.forEach(closeQuestion);
        if (!wasOpen) {
          openQuestion(button);
        }
      });

      // Up/Down arrow keys move between the questions
      button.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          buttons[(index + 1) % buttons.length].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          buttons[(index - 1 + buttons.length) % buttons.length].focus();
        }
      });
    });
  });


  /* ---------- 6. Animal modal (pop-up) ----------
     Any element with data-animal="buddy" opens a pop-up filled in from the
     ANIMALS list in data.js. The pop-up is built the first time it is needed. */
  let modal = null;
  let elementToReturnTo = null;

  function buildModal() {
    modal = el("div", {
      class: "modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title"
    }, [
      el("div", { class: "modal-backdrop", "data-close": "" }),
      el("div", { class: "modal-box" }, [
        el("button", { class: "modal-close", type: "button", "aria-label": "Close animal details", "data-close": "", text: "\u00d7" }),
        el("img", { class: "modal-img", id: "modal-img", alt: "", width: "400", height: "400" }),
        el("div", { class: "modal-body" }, [
          el("h2", { id: "modal-title" }),
          el("p", { class: "meta", id: "modal-meta" }),
          el("p", { class: "badge", id: "modal-status" }),
          el("p", { id: "modal-bio" }),
          el("ul", { class: "tag-list", id: "modal-traits" }),
          el("p", { id: "modal-fee" }),
          el("a", { class: "btn btn-primary", id: "modal-enquire", href: "enquiry.html" })
        ])
      ])
    ]);
    document.body.appendChild(modal);

    // Clicking the dark backdrop or the close button closes the pop-up
    modal.addEventListener("click", function (event) {
      if (event.target.hasAttribute("data-close")) {
        closeModal();
      }
    });
  }

  function openModal(animal, trigger) {
    if (!modal) {
      buildModal();
    }
    elementToReturnTo = trigger;

    modal.querySelector("#modal-img").src = animal.image;
    modal.querySelector("#modal-img").alt = animal.alt;
    modal.querySelector("#modal-title").textContent = animal.name;
    modal.querySelector("#modal-meta").textContent = animal.breed + " \u00b7 " + formatAge(animal.ageMonths) + " \u00b7 " + animal.sex;
    modal.querySelector("#modal-bio").textContent = animal.bio;
    modal.querySelector("#modal-fee").textContent = "Adoption fee: " + formatMoney(animal.fee) + " (covers sterilisation and vaccinations).";

    const status = modal.querySelector("#modal-status");
    status.textContent = animal.status;
    status.className = "badge badge-" + animal.status.toLowerCase();

    const traits = modal.querySelector("#modal-traits");
    traits.textContent = ""; // empty the list before adding this animal's traits
    animal.traits.forEach(function (trait) {
      traits.appendChild(el("li", { class: "tag", text: trait }));
    });

    const enquire = modal.querySelector("#modal-enquire");
    enquire.href = "enquiry.html?type=adopt&animal=" + animal.id;
    enquire.textContent = "Enquire about " + animal.name;

    modal.classList.add("is-open");
    document.body.classList.add("no-scroll"); // stops the page behind from scrolling
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (elementToReturnTo) {
      elementToReturnTo.focus(); // hand focus back to the button that opened the pop-up
    }
  }

  // One click listener for the whole page ("event delegation"): it works for
  // buttons that were added later by JavaScript too, like the animals list.
  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-animal]");
    if (!trigger || typeof findAnimalById !== "function") {
      return;
    }
    const animal = findAnimalById(trigger.dataset.animal);
    if (animal) {
      event.preventDefault(); // if the trigger is a link, don't follow it
      openModal(animal, trigger);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!modal || !modal.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "Tab") {
      trapFocus(modal, event);
    }
  });

});
