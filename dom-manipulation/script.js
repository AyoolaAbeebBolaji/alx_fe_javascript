// Quotes array
let quotes = [
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

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    textInput.value = "";
    categoryInput.value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listener for "Show New Quote" button
newQuoteButton.addEventListener("click", showRandomQuote);
