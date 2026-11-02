/* ===================================================================
   Paws & Hope — forms.js (Enquiry page and Contact page)

   Contents
     1. Validation   one set of rules used by both forms
     2. Enquiry form show the right fields, check them, send with fetch (AJAX),
                     then show a reply about cost and availability
     3. Contact form check the fields, then build an email the visitor can send

   How a form is checked:
     - Each field that needs checking has data-rule="name|email|phone|date|
       message|select|checkbox" in the HTML, and a matching error message
       box (<p id="FIELDID-error">) underneath it.
     - Fields are checked when the visitor leaves them, again while they
       fix a mistake, and again when they press the submit button.
   =================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ===============================================================
     1. VALIDATION
     =============================================================== */

  const MAX_DAYS_AHEAD = 90; // a preferred date must be within this many days

  // Patterns ("regular expressions") describing what a valid value looks like
  const NAME_PATTERN = /^\p{L}[\p{L}' .-]*$/u;            // letters, spaces, apostrophes, full stops, hyphens
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;  // something@something.something
  const PHONE_PATTERN = /^(\+27|0027|0)[1-9][0-9]{8}$/;   // South African numbers (see validatePhone)

  function startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  // Date -> "2026-11-02" (the format a date input uses)
  function toIsoDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  // Each check returns "" when the value is fine, or a message explaining the problem.

  function validateName(value) {
    if (value.length < 2) {
      return "Please enter at least 2 characters.";
    }
    if (!NAME_PATTERN.test(value)) {
      return "Please use letters only (spaces, hyphens and apostrophes are fine).";
    }
    return "";
  }

  function validateEmail(value) {
    if (!EMAIL_PATTERN.test(value)) {
      return "Please enter an email address like name@example.com.";
    }
    return "";
  }

  function validatePhone(value) {
    // Remove spaces, brackets and dashes first, so "082 123 4567" and "(082) 123-4567" both work
    const digits = value.replace(/[\s()-]/g, "");
    if (!PHONE_PATTERN.test(digits)) {
      return "Please enter a South African number, like 082 123 4567 or +27 82 123 4567.";
    }
    return "";
  }

  function validateDate(value) {
    const chosen = new Date(value + "T00:00:00");
    if (isNaN(chosen.getTime())) {
      return "Please enter a valid date.";
    }
    const today = startOfToday();
    const latest = new Date(today);
    latest.setDate(latest.getDate() + MAX_DAYS_AHEAD);

    if (chosen < today) {
      return "Please choose today or a date in the future.";
    }
    if (chosen > latest) {
      return "Please choose a date within the next " + MAX_DAYS_AHEAD + " days.";
    }
    if (chosen.getDay() === 0) {
      return "We are closed on Sundays. Please choose a day from Monday to Saturday.";
    }
    return "";
  }

  function validateMessage(value, field) {
    const minimum = Number(field.dataset.min || 0);
    if (value.length < minimum) {
      return "Please write at least " + minimum + " characters (you have written " + value.length + ").";
    }
    return "";
  }

  // Check ONE field. Returns "" if fine, or the error message.
  function validateField(field) {
    const label = field.dataset.label || "This field";

    // 1. Is a required field empty?
    if (field.type === "checkbox") {
      return field.required && !field.checked ? "Please tick this box to continue." : "";
    }
    const value = field.value.trim();
    if (value === "") {
      if (field.required) {
        return field.tagName === "SELECT" ? "Please choose an option." : label + " is required.";
      }
      return ""; // optional and empty is fine
    }

    // 2. Does the value follow the rule for this kind of field?
    switch (field.dataset.rule) {
      case "name":    return validateName(value);
      case "email":   return validateEmail(value);
      case "phone":   return validatePhone(value);
      case "date":    return validateDate(value);
      case "message": return validateMessage(value, field);
      default:        return "";
    }
  }

  // Show (or clear) the error for one field
  function showError(field, message) {
    const errorBox = document.getElementById(field.id + "-error");
    const hasValue = field.type === "checkbox" ? field.checked : field.value.trim() !== "";

    field.classList.toggle("is-invalid", message !== "");
    field.classList.toggle("is-valid", message === "" && hasValue);

    if (message !== "") {
      field.setAttribute("aria-invalid", "true"); // tells screen readers the field has a problem
    } else {
      field.removeAttribute("aria-invalid");
    }
    if (errorBox) {
      errorBox.textContent = message;
    }
  }

  // Fields inside a hidden block (e.g. the "foster" questions when "adopt" is chosen) are skipped
  function getCheckableFields(form) {
    return Array.from(form.querySelectorAll("[data-rule]")).filter(function (field) {
      return !field.closest("[hidden]");
    });
  }

  // Check every field. Returns true only if all are fine.
  function validateForm(form, summaryBox) {
    let problems = 0;
    let firstInvalid = null;

    getCheckableFields(form).forEach(function (field) {
      const message = validateField(field);
      showError(field, message);
      if (message !== "") {
        problems++;
        if (firstInvalid === null) {
          firstInvalid = field;
        }
      }
    });

    if (problems > 0) {
      summaryBox.textContent = problems === 1
        ? "There is 1 problem with your form. Please fix it and try again."
        : "There are " + problems + " problems with your form. Please fix them and try again.";
      summaryBox.hidden = false;
      firstInvalid.focus(); // take the visitor straight to the first mistake
      return false;
    }

    summaryBox.hidden = true;
    return true;
  }

  // Check fields as the visitor moves through the form
  function enableLiveValidation(form) {
    // "focusout" fires when the visitor leaves a field
    form.addEventListener("focusout", function (event) {
      if (event.target.matches("[data-rule]")) {
        showError(event.target, validateField(event.target));
      }
    });
    // While a field shows an error, re-check on every keystroke so the message disappears as soon as it is fixed
    form.addEventListener("input", function (event) {
      if (event.target.matches("[data-rule]") && event.target.classList.contains("is-invalid")) {
        showError(event.target, validateField(event.target));
      }
    });
    form.addEventListener("change", function (event) {
      if (event.target.matches("[data-rule]")) {
        showError(event.target, validateField(event.target));
      }
    });
  }

  // "123 / 500" counters under message boxes
  function setUpCharacterCounters(form) {
    form.querySelectorAll("textarea[data-counter]").forEach(function (box) {
      const counter = document.getElementById(box.dataset.counter);
      function update() {
        counter.textContent = box.value.length + " / " + box.maxLength;
      }
      box.addEventListener("input", update);
      form.addEventListener("reset", function () { setTimeout(update, 0); });
      update();
    });
  }

  // Stop the date picker offering past dates or dates too far ahead
  function setUpDateLimits(form) {
    const today = startOfToday();
    const latest = new Date(today);
    latest.setDate(latest.getDate() + MAX_DAYS_AHEAD);

    form.querySelectorAll('input[type="date"]').forEach(function (input) {
      input.min = toIsoDate(today);
      input.max = toIsoDate(latest);
    });
  }

  // Clear all error messages and colours (used by "Send another enquiry")
  function clearErrors(form) {
    form.querySelectorAll("[data-rule]").forEach(function (field) {
      showError(field, "");
      field.classList.remove("is-valid");
    });
  }


  /* ===============================================================
     2. ENQUIRY FORM
     =============================================================== */

  const enquiryForm = document.getElementById("enquiry-form");

  if (enquiryForm) {
    const summaryBox = document.getElementById("enquiry-summary");
    const statusBox = document.getElementById("enquiry-status");
    const resultPanel = document.getElementById("enquiry-result");
    const submitButton = enquiryForm.querySelector('button[type="submit"]');
    const animalSelect = document.getElementById("animal");

    enquiryForm.noValidate = true; // use our own messages instead of the browser's pop-up bubbles

    // Fill the animal drop-down from the ANIMALS data (the HTML only has "No preference")
    ANIMALS.forEach(function (animal) {
      const option = el("option", {
        value: animal.id,
        text: animal.name + " (" + animal.species + ", " + formatAge(animal.ageMonths) + ") \u2013 " + animal.status
      });
      animalSelect.appendChild(option);
    });

    // Show only the questions that belong to the chosen kind of enquiry
    function showFieldsForChosenType() {
      const chosen = enquiryForm.querySelector('input[name="enquiryType"]:checked').value;
      enquiryForm.querySelectorAll(".type-fields").forEach(function (block) {
        const types = block.dataset.type.split(" "); // e.g. "adopt foster volunteer"
        block.hidden = !types.includes(chosen);
      });
    }

    // Links such as enquiry.html?type=adopt&animal=buddy pre-fill the form
    function applyLinkChoices() {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      const animalId = params.get("animal");

      const typeRadio = enquiryForm.querySelector('input[name="enquiryType"][value="' + type + '"]');
      if (typeRadio) {
        typeRadio.checked = true;
      }
      if (animalId && findAnimalById(animalId)) {
        animalSelect.value = animalId;
      }
    }

    // ----- What the visitor sees after a successful enquiry -----

    // Next first Saturday of the month on or after today (foster orientation days)
    function nextFirstSaturday() {
      const today = startOfToday();
      for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
        const day = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
        while (day.getDay() !== 6) {
          day.setDate(day.getDate() + 1);
        }
        if (day >= today) {
          return day;
        }
      }
      return today;
    }

    // Work out the reply for this enquiry: a heading and a list of points
    function buildReply(data) {
      const lines = [];
      let heading = "";
      const requestedDate = data.startDate ? formatLongDate(data.startDate) : "";

      if (data.enquiryType === "adopt") {
        const animal = findAnimalById(data.animal);
        heading = "About adopting";
        if (animal) {
          lines.push(animal.name + " is currently " + animal.status.toLowerCase() + ".");
          if (animal.status === "Reserved") {
            lines.push("Another family has reserved " + animal.name + " for now. We have added you to the waiting list and will contact you if that changes.");
          } else {
            lines.push(animal.name + " is ready to meet you.");
          }
          lines.push("The adoption fee for " + animal.name + " is " + formatMoney(animal.fee) + ", which covers sterilisation and vaccinations.");
        } else {
          lines.push("You did not choose a particular animal, so a volunteer will help you find a good match.");
          lines.push("Adoption fees are " + formatMoney(300) + " for rabbits, " + formatMoney(650) + " for cats and " + formatMoney(850) + " for dogs. Each fee covers sterilisation and vaccinations.");
        }
        if (requestedDate) {
          lines.push("You asked for a meet and greet on " + requestedDate + ". We will confirm that day, or suggest the closest free time.");
        }
      } else if (data.enquiryType === "foster") {
        heading = "About fostering";
        lines.push("Fostering costs you nothing: Paws & Hope pays for food and vet care.");
        lines.push("The next foster orientation is on " + formatLongDate(toIsoDate(nextFirstSaturday())) + " at 10:00. Orientations run on the first Saturday of every month.");
        lines.push("Fostering usually lasts between two weeks and three months.");
        if (requestedDate) {
          lines.push("You asked to start on " + requestedDate + ". We will confirm whether that works.");
        }
      } else if (data.enquiryType === "volunteer") {
        heading = "About volunteering";
        lines.push("Volunteering is free, and we will match you to a task that suits you.");
        lines.push("New volunteers join a short induction at the shelter on Saturdays at 09:00. Volunteers must be 16 or older.");
        if (requestedDate) {
          lines.push("You asked to start on " + requestedDate + ". We will confirm the nearest induction.");
        }
      } else if (data.enquiryType === "sponsor") {
        heading = "About sponsoring";
        const amount = Number(data.sponsorAmount);
        if (amount === 1000) {
          lines.push("A once-off gift of " + formatMoney(1000) + " pays for a community sterilisation day.");
        } else if (amount > 0) {
          const yearly = amount * 12;
          lines.push("Your monthly gift of " + formatMoney(amount) + " adds up to " + formatMoney(yearly) + " a year.");
          const effect = { 100: "feeds one shelter animal for a week every month.", 250: "pays for vaccinations and deworming for one animal every month.", 500: "covers the full care of one foster animal each month." };
          lines.push("It " + effect[amount]);
        } else {
          lines.push("Thank you for offering to give a different amount. A team member will talk through the options with you.");
        }
        lines.push("We will email you our bank details and how to set up your gift.");
      }

      lines.push("A team member will reply to " + data.email + " within two working days.");
      return { heading: heading, lines: lines };
    }

    // Replace the form with a thank-you panel built from the visitor's answers
    function showReply(data, reference) {
      const reply = buildReply(data);
      const firstName = data.fullName.split(" ")[0];

      resultPanel.textContent = "";
      resultPanel.appendChild(el("h2", { text: "Thank you, " + firstName + "." }));
      if (reference) {
        resultPanel.appendChild(el("p", { class: "reference", text: "Your enquiry reference is #" + reference + "." }));
      }
      resultPanel.appendChild(el("h3", { text: reply.heading }));

      const list = el("ul", { class: "content-list" });
      reply.lines.forEach(function (line) {
        list.appendChild(el("li", { text: line }));
      });
      resultPanel.appendChild(list);

      const again = el("button", { type: "button", class: "btn btn-dark", text: "Send another enquiry" });
      again.addEventListener("click", function () {
        enquiryForm.reset();
        clearErrors(enquiryForm);
        showFieldsForChosenType();
        resultPanel.hidden = true;
        enquiryForm.hidden = false;
        enquiryForm.querySelector("#full-name").focus();
      });
      resultPanel.appendChild(again);

      enquiryForm.hidden = true;
      resultPanel.hidden = false;
      resultPanel.focus();
    }

    // Gather the answers from the visible fields into one object
    function collectAnswers() {
      const answers = {};
      Array.from(enquiryForm.elements).forEach(function (field) {
        if (!field.name || field.closest("[hidden]")) {
          return; // skip buttons and hidden questions
        }
        if (field.type === "radio" && !field.checked) {
          return;
        }
        answers[field.name] = field.type === "checkbox" ? field.checked : field.value.trim();
      });
      return answers;
    }

    // ----- Send the enquiry in the background (AJAX) -----
    // fetch() sends the data to the address in the form's action attribute without
    // reloading the page. This demo posts to JSONPlaceholder, a free practice
    // server that replies with a reference number but does not store anything.
    async function sendEnquiry(data) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending\u2026";
      statusBox.textContent = "";

      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 10000); // give up after 10 seconds

      try {
        const response = await fetch(enquiryForm.action, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify(data),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("The server replied with status " + response.status + ".");
        }

        const result = await response.json();
        showReply(data, result.id);
      } catch (error) {
        statusBox.textContent = error.name === "AbortError"
          ? "Sending took too long. Please check your internet connection and try again."
          : "We could not send your enquiry just now. Please try again in a moment, or use the Contact page. (" + error.message + ")";
      } finally {
        clearTimeout(timer);
        submitButton.disabled = false;
        submitButton.textContent = "Send enquiry";
      }
    }

    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault(); // stop the normal page reload; we send the data ourselves
      if (validateForm(enquiryForm, summaryBox)) {
        sendEnquiry(collectAnswers());
      }
    });

    enquiryForm.addEventListener("change", function (event) {
      if (event.target.name === "enquiryType") {
        showFieldsForChosenType();
      }
    });

    applyLinkChoices();
    showFieldsForChosenType();
    setUpDateLimits(enquiryForm);
    setUpCharacterCounters(enquiryForm);
    enableLiveValidation(enquiryForm);
  }


  /* ===============================================================
     3. CONTACT FORM
     This site has no mail server, so the form cannot send an email by
     itself. Instead it builds the complete email (to, subject and
     message) and gives the visitor a button that opens it in their own
     email app, ready to send. The recipient is the address in the form's
     action attribute in contact.html: change it there, in one place.
     =============================================================== */

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    const summaryBox = document.getElementById("contact-summary");
    const resultPanel = document.getElementById("contact-result");
    const recipient = contactForm.getAttribute("action").replace(/^mailto:/, "");
    const typeSelect = document.getElementById("c-type");

    contactForm.noValidate = true;

    // Put the answers together as an email
    function buildEmail(answers) {
      const typeLabel = typeSelect.options[typeSelect.selectedIndex].text;
      const subject = typeLabel + " - message from " + answers.name;
      const body = [
        "Name: " + answers.name,
        "Email: " + answers.email,
        "Phone: " + (answers.phone || "not given"),
        "Type of message: " + typeLabel,
        "",
        answers.message.replace(/\r?\n/g, "\r\n") // emails use CRLF line breaks (RFC 6068)
      ].join("\r\n");

      // encodeURIComponent turns spaces and symbols into a form that is safe inside a link
      const link = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      return { to: recipient, subject: subject, body: body, link: link };
    }

    function showEmail(email) {
      resultPanel.textContent = "";
      resultPanel.appendChild(el("h2", { text: "Your email is ready" }));
      resultPanel.appendChild(el("p", { text: "This website has no mail server, so the last step is yours: press the button to open the email in your email app, then press Send there." }));

      const details = el("dl", { class: "email-details" }, [
        el("dt", { text: "To" }),
        el("dd", { text: email.to }),
        el("dt", { text: "Subject" }),
        el("dd", { text: email.subject })
      ]);
      resultPanel.appendChild(details);
      resultPanel.appendChild(el("pre", { class: "email-body", text: email.body }));

      const openLink = el("a", { class: "btn btn-primary", href: email.link, text: "Open in my email app" });

      const copyStatus = el("span", { class: "copy-status", role: "status" });
      const copyButton = el("button", { type: "button", class: "btn btn-outline-dark", text: "Copy email text" });
      copyButton.addEventListener("click", function () {
        const everything = "To: " + email.to + "\nSubject: " + email.subject + "\n\n" + email.body;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(everything).then(
            function () { copyStatus.textContent = "Copied!"; },
            function () { copyStatus.textContent = "Could not copy. Please select the text and copy it yourself."; }
          );
        } else {
          copyStatus.textContent = "Copying is not available here. Please select the text and copy it yourself.";
        }
      });

      const editButton = el("button", { type: "button", class: "btn btn-outline-dark", text: "Change my message" });
      editButton.addEventListener("click", function () {
        resultPanel.hidden = true;
        contactForm.hidden = false;
        contactForm.querySelector("#c-message").focus();
      });

      resultPanel.appendChild(el("div", { class: "card-actions" }, [openLink, copyButton, editButton]));
      resultPanel.appendChild(copyStatus);

      contactForm.hidden = true;
      resultPanel.hidden = false;
      resultPanel.focus();
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateForm(contactForm, summaryBox)) {
        return;
      }
      const answers = {
        name: document.getElementById("c-name").value.trim(),
        email: document.getElementById("c-email").value.trim(),
        phone: document.getElementById("c-phone").value.trim(),
        message: document.getElementById("c-message").value.trim()
      };
      showEmail(buildEmail(answers));
    });

    setUpCharacterCounters(contactForm);
    enableLiveValidation(contactForm);
  }

});
