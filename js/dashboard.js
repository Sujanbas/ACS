
    //Sidebar
    const buttons = document.querySelectorAll('#sidebar button');
    const sections = document.querySelectorAll('.dashboard-section');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const sectionId = button.getAttribute('data-section');
        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === sectionId) {
            section.classList.add('active');
          }
        });
      });
    });

   
    //Fuel Price Js
document.addEventListener("DOMContentLoaded", () => {
  const fuelTypeInput = document.getElementById("fuelTypeInput");
  const newPriceInput = document.getElementById("newFuelPriceInput");
  const fuelMessage = document.getElementById("fuelMessage");
  const priceCards = document.querySelectorAll(".price-card");

  // Load saved prices on page load
  const savedPrices = JSON.parse(localStorage.getItem("fuelPrices")) || {};
  priceCards.forEach(card => {
    const type = card.getAttribute("data-type");
    const priceEl = card.querySelector("p");
    if (savedPrices[type]) {
      priceEl.textContent = savedPrices[type];
    }
  });

  // Clicking a card fills in the type
  priceCards.forEach(card => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-type");
      fuelTypeInput.value = type;
    });
  });

  // Updating price
  document.getElementById("updateFuelBtn").addEventListener("click", () => {
    const type = fuelTypeInput.value.trim();
    const price = newPriceInput.value.trim();

    if (!type || !price) {
      showFuelMessage("Please enter both fuel type and new price.", true);
      return;
    }

    const card = Array.from(priceCards).find(c => c.getAttribute("data-type") === type);
    if (card) {
      const priceEl = card.querySelector("p");
      priceEl.textContent = price;

      // Save to localStorage
      savedPrices[type] = price;
      localStorage.setItem("fuelPrices", JSON.stringify(savedPrices));

      showFuelMessage(`Price updated for ${type}.`, false);
    } else {
      showFuelMessage("Fuel type not found. Click on a fuel card or check spelling.", true);
    }
  });

  function showFuelMessage(message, isError) {
    fuelMessage.textContent = message;
    fuelMessage.style.display = "block";
    fuelMessage.style.borderLeftColor = isError ? "#f44336" : "#00bcd4";
    setTimeout(() => (fuelMessage.style.display = "none"), 3000);
  }
});

//Feed Section Js

// Update price button click handler
document.getElementById("updatePriceBtn").addEventListener("click", () => {
  const productName = productInput.value.trim();
  let newPrice = priceInput.value.trim();

  if (!productName || !newPrice) {
    alert("Please enter both a product name and a new price.");
    return;
  }

  // Validate price format: allow optional $ and 1 or 2 decimals
  if (!/^\$?\d+(\.\d{1,2})?$/.test(newPrice)) {
    alert("Please enter a valid price (e.g., $25 or 25.00).");
    return;
  }

  // Auto-add $ prefix if missing
  if (!newPrice.startsWith("$")) {
    newPrice = "$" + newPrice;
  }

  let productFound = false;

  data = data.map(item => {
    if (item.product.toLowerCase() === productName.toLowerCase()) {
      productFound = true;
      return { ...item, price: newPrice };
    }
    return item;
  });

  if (productFound) {
    localStorage.setItem("feedData", JSON.stringify(data));
    renderFeedTable();
    alert(`Price for "${productName}" updated to ${newPrice}.`);
  } else {
    alert(`Product "${productName}" not found.`);
  }

  productInput.value = "";
  priceInput.value = "";
  suggestionsBox.innerHTML = "";
});

// Autocomplete suggestions on product name input
productInput.addEventListener("input", () => {
  const query = productInput.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  if (query.length === 0) return;

  const matches = data
    .filter(item => item.product.toLowerCase().includes(query))
    .slice(0, 5);

  matches.forEach(match => {
    const suggestion = document.createElement("div");
    suggestion.textContent = match.product;
    suggestion.classList.add("suggestion-item");
    suggestion.addEventListener("click", () => {
      productInput.value = match.product;
      suggestionsBox.innerHTML = "";
      priceInput.focus();
    });
    suggestionsBox.appendChild(suggestion);
  });
});

// Hide suggestions when clicking outside
document.addEventListener("click", e => {
  if (!suggestionsBox.contains(e.target) && e.target !== productInput) {
    suggestionsBox.innerHTML = "";
  }
});


//Deli section Js
    const productInput = document.getElementById("product-name");
  const newPriceInput = document.getElementById("new-price");
  const updateButton = document.getElementById("update-price-btn");
  const suggestionsBox = document.getElementById("suggestions");

  // Build product list from existing DOM
  const products = Array.from(document.querySelectorAll(".menu-item")).map(item => ({
    name: item.getAttribute("data-name"),
    element: item
  }));

  // Auto-suggestions when typing
  productInput.addEventListener("input", () => {
    const query = productInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";
    if (!query) return;

    const matches = products
      .filter(p => p.name.toLowerCase().includes(query))
      .slice(0, 5);

    matches.forEach(match => {
      const div = document.createElement("div");
      div.textContent = match.name;
      div.addEventListener("click", () => {
        productInput.value = match.name;
        suggestionsBox.innerHTML = "";
      });
      suggestionsBox.appendChild(div);
    });
  });

  // Hide suggestions on click elsewhere
  document.addEventListener("click", (e) => {
    if (e.target !== productInput) {
      suggestionsBox.innerHTML = "";
    }
  });

  // Update Price on Button Click
  updateButton.addEventListener("click", () => {
    const name = productInput.value.trim().toLowerCase();
    const price = parseFloat(newPriceInput.value.replace(/[^0-9.]/g, ""));

    if (!name || isNaN(price)) {
      alert("Please enter a valid product name and price.");
      return;
    }

    const match = products.find(p => p.name.toLowerCase() === name);
    if (!match) {
      alert("Product not found.");
      return;
    }

    // Update DOM
    const priceTag = match.element.querySelector(".price-tag, .item-price");
    if (priceTag) {
      priceTag.textContent = `$${price.toFixed(2)}`;
      match.element.setAttribute("data-price", price.toFixed(2));
      alert("Price updated successfully!");
    } else {
      alert("Unable to find price display element.");
    }
  });
