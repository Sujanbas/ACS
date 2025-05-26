// feed.js

// Load from localStorage or use default data
let storedData = JSON.parse(localStorage.getItem("feedData"));
let data = Array.isArray(storedData) && storedData.length > 0
  ? storedData
  : [
      { category: "Poultry Feed", quantity: "50 LB", product: "Hen Scratch", price: "$18" },
      { quantity: "50 LB", product: "Multigrain Scratch", price: "$21" },
      { quantity: "50 LB", product: "3-Way Scratch", price: "$19" },
      { quantity: "50 LB", product: "Game Bird Mix", price: "$23" },
      { category: "Cattle Feed", quantity: "50 LB", product: "16% Layer Pellets", price: "$19" },
      { quantity: "50 LB", product: "21% Layer Pellets", price: "$20" },
      { quantity: "50 LB", product: "18% Chick Starter Grower", price: "$19" },
      { quantity: "50 LB", product: "24% Chick Starter Grower", price: "$21" },
      { quantity: "50 LB", product: "10% Saddle Up", price: "$21" },
      { quantity: "50 LB", product: "10% All Grain", price: "$23" },
      { quantity: "50 LB", product: "12% All Grain", price: "$23" },
      { category: "Minerals", quantity: "50 LB", product: "Plain White Block Salt", price: "$15" },
      { quantity: "50 LB", product: "Trace Mineral Block", price: "$17" },
      { category: "Pet Feeds", quantity: "50 LB", product: "Rabbit Pellets", price: "$24" },
      { quantity: "50 LB", product: "Corn Chaff", price: "$16" },
      { quantity: "50 LB", product: "Whole Corn", price: "$15" },
      { quantity: "50 LB", product: "Whole Oats", price: "$19" },
      { quantity: "50 LB", product: "Crimped Oats", price: "$21" },
      { quantity: "40 LB", product: "21% Orange Sports Mix", price: "$29" },
      { quantity: "50 LB", product: "Energy Plus Black Sports Mix Bag", price: "$41" },
      { quantity: "50 LB", product: "Green Sports Mix Bag", price: "$36" },
      { quantity: "50 LB", product: "High Energy Blue Sports Mix Bag", price: "$41" },
      { quantity: "15 LB", product: "Cat Food Type 15 LB", price: "$18" },
      { quantity: "31 LB", product: "Cat Food Type 31 LB", price: "$31" },
      { quantity: "50 LB", product: "Delight Bites White Bag", price: "$29" },
      { quantity: "50 LB", product: "Value Pack Black Bag", price: "$41" },
      { quantity: "50 LB", product: "Red Value Pack", price: "$38" },
    ];

// Trim product names for consistent matching
data = data.map(item => ({ ...item, product: item.product.trim() }));

const tbody = document.querySelector("#priceTable tbody");
const productInput = document.getElementById("productName");
const priceInput = document.getElementById("newPrice");
const suggestionsBox = document.getElementById("suggestions");

// Render the feed price table
function renderFeedTable() {
  tbody.innerHTML = "";
  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="category" data-label="Category">${item.category || ""}</td>
      <td data-label="Quantity">${item.quantity || ""}</td>
      <td data-label="Product">${item.product || ""}</td>
      <td data-label="Price">${item.price || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

renderFeedTable();
