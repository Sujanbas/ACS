document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const itemSelect = document.getElementById('item');
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
    const burgerItems = [
      "Crispy Chicken Sandwich", "Spicy Chicken Sandwich", "Ham Burger"
    ];
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const item = itemSelect.value;
    const quantity = parseInt(quantityInput.value);
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pizzaSize = pizzaSizeSelect.value;
    const selectedPizzaToppings = [...document.querySelectorAll('.pizza-topping:checked')];

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
          if (toppingCount === 0) {
            price = 9.99;
          } else {
            price = 14.99 + ((toppingCount - 1) * 1.00);
          }
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
      const prices = {
        "Crispy Chicken Sandwich": 4.99,
        "Spicy Chicken Sandwich": 3.99,
        "Ham Burger": 5.99,
        "Cheese Sticks": 3.99,
        "Cheese Potatoes": 2.99,
        "Wedges": 2.49,
        "Fries": 2.99,
        "Corndog": 2.19,
        "Shrimp Basket": 5.99,
        "Chicken Fingers": 3.99,
        "Chicken Bites": 3.99,
        "Chicken Nuggets": 3.99
      };
      price = prices[item] || 0;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.name === itemDescription);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        name: itemDescription,
        quantity,
        price: parseFloat(price.toFixed(2))
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${quantity} x ${itemDescription} added to cart.`);
    window.location.href = 'cart.html';
  });
});

const itemSelect = document.getElementById('item');
const productPreview = document.getElementById('productPreview');
const previewItems = document.querySelectorAll('.preview-item');

itemSelect.addEventListener('change', function () {
  // Hide all preview items
  previewItems.forEach(el => el.classList.remove('active'));

  const selectedValue = this.value.trim().replace(/\s+/g, '-');
  const targetId = `preview-${selectedValue}`;
  const targetItem = document.getElementById(targetId);

  if (targetItem) {
    productPreview.classList.add('active');
    targetItem.classList.add('active');
  } else {
    productPreview.classList.remove('active');
  }
});
