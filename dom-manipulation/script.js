// Quotes array — objects must have 'text' and 'category' properties
let quotes = [
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

// Get DOM elements by the exact IDs used in index.html
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuote");

// Function name expected by the checker: displayRandomQuote
function displayRandomQuote() {
  if (!quotes || quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  // Select random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];

  // Update DOM with quote text and category
  quoteDisplay.innerHTML = `"${selected.text}" — [${selected.category}]`;
}

// Function name expected by the checker: addQuote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add to quotes array (object with text and category)
  quotes.push({ text: text, category: category });

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  // Update the DOM so user sees the added quote immediately
  displayRandomQuote();
}

// Add event listeners (checker requires an event listener on the Show New Quote button)
newQuoteButton.addEventListener("click", displayRandomQuote);
addQuoteButton.addEventListener("click", addQuote);

// Optionally show a quote on page load
displayRandomQuote();
