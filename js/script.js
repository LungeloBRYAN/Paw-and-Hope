/* ============================================
   Paws & Hope Animal Rescue - Main JavaScript
   ============================================
   This file adds a small bit of interactivity to the site:
   1. Updates the copyright year in the footer automatically
   2. Shows/hides the menu on small screens (mobile)
   3. Shows a simple thank-you message when a form is submitted

   There is no server to actually send the forms to yet, so for
   now we just show a message. This will be connected properly
   in a later part of this project.
*/

// Wait until the page has fully loaded before running any code
document.addEventListener("DOMContentLoaded", function () {

  // 1. Update the footer year so it doesn't need to be edited by hand
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    var today = new Date();
    yearSpan.textContent = today.getFullYear();
  }

  // 2. Mobile menu button - clicking it shows or hides the nav links
  var menuButton = document.getElementById("menu-btn");
  var navList = document.getElementById("nav-list");

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      navList.classList.toggle("show");
    });
  }

  // 3. Enquiry form - show a message instead of actually submitting
  var enquiryForm = document.getElementById("enquiry-form");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault(); // stop the page from reloading
      alert("Thank you for your enquiry! We will get back to you soon.");
      enquiryForm.reset();
    });
  }

  // Contact form - same idea as the enquiry form above
  var contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();
    });
  }

});
