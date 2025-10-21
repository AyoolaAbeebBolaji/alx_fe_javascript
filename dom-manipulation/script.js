// Initialize quotes array
let quotes = [];

// Load quotes from local storage or default
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
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        category: "Inspiration",
      },
    ];
    saveQuotes();
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Get quotes according to selected category
function getFilteredQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter((q) => q.category === selectedCategory);
}

// Dynamically create Add Quote Form
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

// Add a new quote
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
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Populate the dropdown with unique categories
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  // Clear and repopulate dropdown
  categoryFilter.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory && categories.includes(lastCategory)) {
    categoryFilter.value = lastCategory;
  }
}

// Filter quotes when category changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category!";
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  }
}

// Export quotes as JSON file
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

// Import quotes from JSON file
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

// Initialize app
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportJsonButton = document.getElementById("exportJson");

newQuoteButton.addEventListener("click", showRandomQuote);
exportJsonButton.addEventListener("click", exportToJsonFile);

// Load and setup UI
loadQuotes();
createAddQuoteForm();
populateCategories();

// Restore last viewed quote and filter
const lastQuote = sessionStorage.getItem("lastViewedQuote");
if (lastQuote) {
  const q = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${q.text}" — <em>${q.category}</em>`;
}

filterQuotes(); // Display quotes based on last selected category
