// -----------------------------
// GLOBAL VARIABLES & INITIAL LOAD
// -----------------------------
let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportJsonButton = document.getElementById("exportJson");
const syncButton = document.getElementById("syncQuotes");
const syncStatus = document.getElementById("syncStatus");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

// -----------------------------
// LOCAL STORAGE MANAGEMENT
// -----------------------------
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      {
        text: "The journey of a thousand miles begins with a single step.",
        category: "Motivation",
      },
      { text: "Knowledge is power.", category: "Education" },
      {
        text: "Success is not final; failure is not fatal.",
        category: "Inspiration",
      },
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -----------------------------
// DOM MANIPULATION
// -----------------------------
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function getFilteredQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  return selectedCategory === "all"
    ? quotes
    : quotes.filter((q) => q.category === selectedCategory);
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("New quote added!");
  } else {
    alert("Please enter both fields.");
  }
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory && categories.includes(lastCategory)) {
    categoryFilter.value = lastCategory;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes found in this category!";
  } else {
    const quote =
      filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  }
}

// -----------------------------
// JSON IMPORT / EXPORT
// -----------------------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -----------------------------
// SERVER SYNC & CONFLICT RESOLUTION
// -----------------------------
async function syncWithServer() {
  syncStatus.textContent = "Syncing with server...";
  syncStatus.style.color = "orange";

  try {
    // Simulate fetching from server
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Take first 5 mock items to simulate quotes
    const serverQuotes = serverData.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));

    // Conflict Resolution: Server data takes precedence
    const combined = [...serverQuotes, ...quotes];
    const uniqueQuotes = [];
    const seen = new Set();

    combined.forEach((q) => {
      const key = q.text.toLowerCase();
      if (!seen.has(key)) {
        uniqueQuotes.push(q);
        seen.add(key);
      }
    });

    quotes = uniqueQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();

    syncStatus.textContent = "Sync complete (Server data updated).";
    syncStatus.style.color = "green";
  } catch (error) {
    syncStatus.textContent = "Error syncing with server!";
    syncStatus.style.color = "red";
  }
}

// -----------------------------
// INITIALIZATION
// -----------------------------
newQuoteButton.addEventListener("click", showRandomQuote);
exportJsonButton.addEventListener("click", exportToJsonFile);
syncButton.addEventListener("click", syncWithServer);

loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();

// Auto-sync every 60 seconds (for realism)
setInterval(syncWithServer, 60000);
