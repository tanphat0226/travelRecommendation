// --- Task 6: Mocking the API Data ---
// In a real scenario, this would be fetched from 'travel_recommendation_api.json'
let apiData = null;
document.addEventListener("DOMContentLoaded", function () {
  fetch("travel_recommendation_api.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => (apiData = data))
    .catch((error) => console.error("Error:", error));
});

// --- Navigation Logic ---
function navigateTo(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.remove("active");
    // Reset display property logic for Home
    if (page.id === "home") page.style.display = "none";
  });

  // Show selected page
  const selectedPage = document.getElementById(pageId);
  selectedPage.classList.add("active");

  // Flex fix for home page
  if (pageId === "home") selectedPage.style.display = "flex";

  // Task 4 Note: Hide Search bar on About Us (and Contact)
  const searchContainer = document.getElementById("searchBarContainer");
  if (pageId === "about" || pageId === "contact") {
    searchContainer.style.display = "none";
  } else {
    searchContainer.style.display = "flex";
  }
}

// --- Task 7, 8, 9, 10: Search & Results Logic ---
function searchDestinations() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("recommendations-overlay");
  resultsDiv.innerHTML = ""; // Clear previous results
  resultsDiv.style.display = "none";

  if (!input) return;

  let results = [];

  // Keyword matching logic
  if (input.includes("beach")) {
    results = apiData.beaches;
  } else if (input.includes("temple")) {
    results = apiData.temples;
  } else if (input.includes("country") || input.includes("countries")) {
    // For countries, we return the cities inside them
    apiData.countries.forEach((country) => {
      results = results.concat(country.cities);
    });

    // Also check specific country names like "Japan" or "Australia"
    if (results.length === 0) {
      const foundCountry = apiData.countries.find(
        (c) => c.name.toLowerCase() === input
      );
      if (foundCountry) results = foundCountry.cities;
    }
  } else {
    // Fallback: check if input matches specific countries directly
    const foundCountry = apiData.countries.find((c) =>
      c.name.toLowerCase().includes(input)
    );
    if (foundCountry) {
      results = foundCountry.cities;
    }
  }

  if (results.length > 0) {
    resultsDiv.style.display = "block";
    results.forEach((place) => {
      // Task 10: Time calculation
      let timeString = "";
      if (place.timeZone) {
        const options = {
          timeZone: place.timeZone,
          hour12: true,
          hour: "numeric",
          minute: "numeric",
        };
        timeString = new Date().toLocaleTimeString("en-US", options);
      }

      const card = document.createElement("div");
      card.className = "rec-card";
      card.innerHTML = `
                        <img src="${place.imageUrl}" alt="${place.name}">
                        <div class="rec-info">
                            <h3>${place.name}</h3>
                            ${
                              timeString
                                ? `<div class="rec-time"><i class="far fa-clock"></i> ${timeString}</div>`
                                : ""
                            }
                            <p>${place.description}</p>
                            <button class="btn-visit">Visit</button>
                        </div>
                    `;
      resultsDiv.appendChild(card);
    });
  } else {
    alert("No recommendations found. Try 'beach', 'temple', or 'country'.");
  }
}

// Task 9: Clear Button
function clearResults() {
  document.getElementById("searchInput").value = "";
  const resultsDiv = document.getElementById("recommendations-overlay");
  resultsDiv.innerHTML = "";
  resultsDiv.style.display = "none";
}

// Helper: Ensure Home is active on load
window.onload = function () {
  navigateTo("home");
};
