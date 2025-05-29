import { db, collection, getDocs } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Load menu items from Firestore
  const menuRef = collection(db, 'menu');
  const snapshot = await getDocs(menuRef);
  const menuData = [];
  const itemSelect = document.getElementById('item');
  // Clear existing options (except placeholder)
  itemSelect.innerHTML = '<option value="">-- Choose an item --</option>';

  snapshot.forEach(doc => {
    const data = doc.data();
    menuData.push(data);
    const option = document.createElement('option');
    option.value = data.name;
    option.textContent = `${data.name} - $${data.price.toFixed(2)}`;
    itemSelect.appendChild(option);
  });

  // Store locally for quick access
  localStorage.setItem('menuData', JSON.stringify(menuData));

  // Other DOM elements
  const form = document.getElementById('orderForm');
  const quantityInput = document.getElementById('quantity');
  const toppingsSection = document.getElementById('toppingsSection');
  const burgerToppings = document.querySelectorAll('.topping');
  const everythingToppings = document.getElementById('everythingToppings');
  const pizzaOptions = document.getElementById('pizzaOptions');
  const pizzaEverything = document.getElementById('pizzaEverything');
  const pizzaToppings = document.querySelectorAll('.pizza-topping');
  const pizzaSizeSelect = document.getElementById('pizzaSize');

  // Show/hide toppings based on selected item
  itemSelect.addEventListener('change', () => {
    const burgerItems = ["Crispy Chicken Sandwich", "Spicy Chicken Sandwich", "Ham Burger"];
    const isBurger = burgerItems.includes(itemSelect.value);
    const isPizza = itemSelect.value === "Pizza";

    toppingsSection.style.display = isBurger ? 'block' : 'none';
    pizzaOptions.style.display = isPizza ? 'block' : 'none';

    if (!isBurger) everythingToppings.checked = false;
    if (!isPizza) {
      pizzaEverything.checked = false;
      pizzaToppings.forEach(t => t.checked = false);
    }
  });

  everythingToppings.addEventListener('change', () => {
    burgerToppings.forEach(cb => cb.checked = everythingToppings.checked);
  });

  pizzaEverything.addEventListener('change', () => {
    pizzaToppings.forEach(cb => cb.checked = pizzaEverything.checked);
  });

  // Form submit event: only update localStorage
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const item = itemSelect.value;
    const quantity = parseInt(quantityInput.value);
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pizzaSize = pizzaSizeSelect.value;
    const selectedPizzaToppings = [...document.querySelectorAll('.pizza-topping:checked')];
    const burgerToppingsChecked = [...document.querySelectorAll('.topping:checked')];
    const request = document.getElementById('request').value.trim();

    if (!item || !quantity || !name || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    let itemDescription = item;
    let price = 0;

    if (item === "Pizza") {
      const toppingCount = selectedPizzaToppings.length;
      switch (pizzaSize) {
        case "Small":
          price = 5.99 + (0.25 * toppingCount);
          break;
        case "Medium":
          price = toppingCount === 0 ? 9.99 : 14.99 + ((toppingCount - 1) * 1.00);
          break;
        case "Large":
          price = 16.99 + (1.00 * toppingCount);
          break;
        default:
          alert("Please select a pizza size.");
          return;
      }
      itemDescription = `Pizza (${pizzaSize})`;
    } else {
      // Retrieve price from loaded menuData
      const found = menuData.find(i => i.name === item);
      if (!found) {
        alert('Item price not found. Try reloading the page.');
        return;
      }
      price = found.price;
    }

    const burgerToppingsValues = burgerToppingsChecked.map(cb => cb.value);
    const pizzaToppingsValues = selectedPizzaToppings.map(cb => cb.value);

    // Update cart in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.name === itemDescription);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        name: itemDescription,
        quantity,
        price: parseFloat(price.toFixed(2)),
        toppings: item === "Pizza" ? pizzaToppingsValues : burgerToppingsValues,
        pizzaSize: item === "Pizza" ? pizzaSize : null,
        request,
        nameInput: name,
        phoneInput: phone
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${quantity} x ${itemDescription} added to cart.`);
    window.location.href = 'cart.html';
  });

  // Product preview logic
  const productPreview = document.getElementById('productPreview');
  const previewItems = document.querySelectorAll('.preview-item');

  itemSelect.addEventListener('change', function () {
    previewItems.forEach(el => el.classList.remove('active'));
    const selectedValue = this.value.trim().replace(/\s+/g, '-');
    const targetItem = document.getElementById(`preview-${selectedValue}`);
    if (targetItem) {
      productPreview.classList.add('active');
      targetItem.classList.add('active');
    } else {
      productPreview.classList.remove('active');
    }
  });
});
