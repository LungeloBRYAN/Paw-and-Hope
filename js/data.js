/* ===================================================================
   Paws & Hope Animal Rescue — site data (Part 3)

   Keeping the animals and events in one place means the homepage
   pop-up, the animals list on the Services page and the Enquiry form
   all read the SAME information. To add an animal, add one more block
   to the ANIMALS list below and every page picks it up.

   All animals, fees and dates are made-up examples for this project.
   =================================================================== */

const ANIMALS = [
  {
    id: "buddy",
    name: "Buddy",
    species: "dog",
    breed: "Mixed breed",
    sex: "Male",
    ageMonths: 36,
    status: "Available",
    fee: 850,
    image: "images/buddy-brown-mixed-breed-dog.svg",
    alt: "Illustration of Buddy, a scruffy brown mixed-breed dog",
    bio: "Gentle and food-motivated, Buddy is house-trained and loves long walks. Good with children and other dogs.",
    traits: ["House-trained", "Good with children", "Good with other dogs"]
  },
  {
    id: "zola",
    name: "Zola",
    species: "dog",
    breed: "Labrador cross",
    sex: "Female",
    ageMonths: 18,
    status: "Available",
    fee: 850,
    image: "images/zola-golden-labrador-cross-dog.svg",
    alt: "Illustration of Zola, a golden labrador-cross dog with floppy ears",
    bio: "Zola is a bouncy, affectionate young dog who loves fetch and learns quickly. She needs a secure garden and an owner who enjoys training.",
    traits: ["Loves fetch", "Needs a garden", "Quick learner"]
  },
  {
    id: "max",
    name: "Max",
    species: "dog",
    breed: "Mixed breed",
    sex: "Male",
    ageMonths: 108,
    status: "Reserved",
    fee: 850,
    image: "images/max-senior-black-dog.svg",
    alt: "Illustration of Max, a senior black dog with a grey muzzle",
    bio: "Max is a calm, gentle senior who is happiest on a soft bed near his people. He is house-trained, great with children and would suit a quiet home.",
    traits: ["Senior", "House-trained", "Calm"]
  },
  {
    id: "nala",
    name: "Nala",
    species: "cat",
    breed: "Domestic shorthair",
    sex: "Female",
    ageMonths: 12,
    status: "Available",
    fee: 650,
    image: "images/nala-ginger-shorthair-cat.svg",
    alt: "Illustration of Nala, a ginger shorthair cat with white whiskers",
    bio: "Curious and affectionate once she trusts you. Nala would do best as an only cat with a patient owner.",
    traits: ["Shy at first", "Best as an only cat", "Affectionate"]
  },
  {
    id: "pepper",
    name: "Pepper",
    species: "cat",
    breed: "Domestic shorthair",
    sex: "Female",
    ageMonths: 4,
    status: "Available",
    fee: 650,
    image: "images/pepper-grey-kitten.svg",
    alt: "Illustration of Pepper, a grey kitten with big dark eyes",
    bio: "Pepper is a playful kitten who has grown up around children and other kittens. She is litter-trained and will be sterilised before she goes home.",
    traits: ["Playful", "Litter-trained", "Good with children"]
  },
  {
    id: "tigger",
    name: "Tigger",
    species: "cat",
    breed: "Tabby",
    sex: "Male",
    ageMonths: 30,
    status: "Available",
    fee: 650,
    image: "images/tigger-brown-tabby-cat.svg",
    alt: "Illustration of Tigger, a brown tabby cat",
    bio: "Tigger is an easygoing tabby who enjoys window seats and head scratches. He gets along with other cats and suits a home with a safe garden or balcony.",
    traits: ["Easygoing", "Good with other cats", "Loves window seats"]
  },
  {
    id: "thistle",
    name: "Thistle",
    species: "rabbit",
    breed: "Mixed breed",
    sex: "Female",
    ageMonths: 8,
    status: "Available",
    fee: 300,
    image: "images/thistle-grey-rabbit.svg",
    alt: "Illustration of Thistle, a grey rabbit with tall ears",
    bio: "Litter-trained and sociable, Thistle needs a secure hutch or bunny-proofed indoor space and daily attention.",
    traits: ["Litter-trained", "Sociable", "Needs daily attention"]
  },
  {
    id: "clover",
    name: "Clover",
    species: "rabbit",
    breed: "Mixed breed",
    sex: "Female",
    ageMonths: 14,
    status: "Reserved",
    fee: 300,
    image: "images/clover-white-rabbit.svg",
    alt: "Illustration of Clover, a white rabbit with pink inner ears",
    bio: "Clover is a gentle, curious rabbit who loves fresh herbs. She is happiest with a rabbit-friendly family and plenty of room to hop.",
    traits: ["Gentle", "Curious", "Loves fresh herbs"]
  }
];

/* Outreach days (sterilisation / vaccination drives). Dates are written as
   YYYY-MM-DD. The Services page only shows the ones that have not passed. */
const OUTREACH_EVENTS = [
  { date: "2026-12-06", focus: "Sterilisation & deworming",        location: "Alexandra Community Hall" },
  { date: "2027-01-03", focus: "Vaccination drive",                location: "Diepsloot Community Centre" },
  { date: "2027-02-07", focus: "Sterilisation & owner education",  location: "Alexandra Community Hall" },
  { date: "2027-03-07", focus: "Vaccination drive",                location: "Diepsloot Community Centre" }
];

/* ---------- Small helper functions ---------- */

// Find one animal by its id, e.g. findAnimalById("buddy"). Returns null if there is no match.
function findAnimalById(id) {
  return ANIMALS.find(function (animal) { return animal.id === id; }) || null;
}

// 36 -> "3 years", 8 -> "8 months"
function formatAge(months) {
  if (months < 12) {
    return months + (months === 1 ? " month" : " months");
  }
  const years = Math.floor(months / 12);
  return years + (years === 1 ? " year" : " years");
}

// 850 -> "R850", 3000 -> "R3 000"
// A space between the thousands is the South African style. We build it ourselves
// because toLocaleString() gives different results in different browsers.
function formatMoney(rand) {
  return "R" + String(rand).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2026-12-06" -> "Sunday 6 December 2026"
// (the time is added so the date is read in local time; the names are written out
// because toLocaleDateString() puts commas in different places in different browsers)
function formatLongDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  return WEEKDAY_NAMES[date.getDay()] + " " + date.getDate() + " " + MONTH_NAMES[date.getMonth()] + " " + date.getFullYear();
}
