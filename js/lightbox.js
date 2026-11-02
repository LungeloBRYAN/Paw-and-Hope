/* ===================================================================
   Paws & Hope — lightbox.js (About page gallery)

   Every gallery picture is a normal link to the picture file, so if
   JavaScript is off the link still opens the picture. With JavaScript
   on, clicking it opens a larger view (a "lightbox") instead.

   Controls: Next/Previous buttons, the left/right arrow keys, a swipe on
   a touch screen, and Escape (or the close button) to close.
   =================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const links = Array.from(document.querySelectorAll(".gallery-link"));
  if (links.length === 0) {
    return; // this page has no gallery
  }

  let lightbox = null;
  let image = null;
  let caption = null;
  let counter = null;
  let currentIndex = 0;
  let linkToReturnTo = null;

  function buildLightbox() {
    image = el("img", { class: "lightbox-img", alt: "" });
    caption = el("figcaption", { class: "lightbox-caption" });
    counter = el("p", { class: "lightbox-counter", "aria-live": "polite" });

    lightbox = el("div", {
      class: "lightbox",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Picture viewer"
    }, [
      el("div", { class: "lightbox-backdrop", "data-close": "" }),
      el("button", { class: "lightbox-close", type: "button", "aria-label": "Close picture viewer", "data-close": "", text: "\u00d7" }),
      el("button", { class: "lightbox-nav lightbox-prev", type: "button", "aria-label": "Previous picture", text: "\u2039" }),
      el("button", { class: "lightbox-nav lightbox-next", type: "button", "aria-label": "Next picture", text: "\u203a" }),
      el("figure", { class: "lightbox-figure" }, [image, caption, counter])
    ]);
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target.hasAttribute("data-close")) {
        closeLightbox();
      }
    });
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { showPicture(currentIndex - 1); });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () { showPicture(currentIndex + 1); });

    // Swipe left/right on a touch screen
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 50) {
        showPicture(distance < 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });
  }

  // Show picture number "index". Going past the end wraps round to the other end.
  function showPicture(index) {
    currentIndex = (index + links.length) % links.length;
    const link = links[currentIndex];
    const thumbnail = link.querySelector("img");

    image.src = link.getAttribute("href");
    image.alt = thumbnail.alt;
    caption.textContent = link.dataset.caption || thumbnail.alt;
    counter.textContent = "Picture " + (currentIndex + 1) + " of " + links.length;
  }

  function openLightbox(index, link) {
    if (!lightbox) {
      buildLightbox();
    }
    linkToReturnTo = link;
    showPicture(index);
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (linkToReturnTo) {
      linkToReturnTo.focus();
    }
  }

  links.forEach(function (link, index) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // open the lightbox instead of the bare image file
      openLightbox(index, link);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      showPicture(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      showPicture(currentIndex - 1);
    } else if (event.key === "Tab") {
      trapFocus(lightbox, event);
    }
  });

});
