const cardsContainer = document.querySelector('.cards-container');
const buttons = document.querySelectorAll('.filter-button button');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total');
const showRowsFilter = document.getElementById('showRows');

// Initialize an array to hold fetched products
let products = [];
let currentCategory = 'all';

// Initialize an array for the cart and retrieve it from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch data from the given URL
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const addItemToLocalStorage = (item, quantity) => {
  // Retrieve existing cart from localStorage or initialize an empty array
  // const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if item already exists in cart
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    // Update the quantity of the existing item
    existingItem.quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({ ...item, quantity });
  }

  // Save updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to create a card element based on an item
const createCard = (item) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', item.id);

  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.name;
  figure.appendChild(img);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = item.title;

  const cardDescription = document.createElement('p');
  cardDescription.textContent = item.shortDescription;

  const cardPrice = document.createElement('p');
  cardPrice.classList.add('card-price');
  cardPrice.textContent = `$${item.price}`;

  const shop = document.createElement('div');
  shop.classList.add('shop');

  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('quantity-container');

  const decreaseButton = document.createElement('button');
  decreaseButton.textContent = '-';
  decreaseButton.classList.add('quantity-button');

  let quantityValue = 0;
  const quantityDisplay = document.createElement('span');
  quantityDisplay.textContent = '0';

  decreaseButton.onclick = () => {
    if (quantityValue > 0) {
      quantityValue--;
      quantityDisplay.textContent = quantityValue;
    }
  };

  const increaseButton = document.createElement('button');
  increaseButton.textContent = '+';
  increaseButton.classList.add('quantity-button');

  increaseButton.onclick = () => {
    quantityValue++;
    quantityDisplay.textContent = quantityValue;
  };

  quantityContainer.appendChild(decreaseButton);
  quantityContainer.appendChild(quantityDisplay);
  quantityContainer.appendChild(increaseButton);

  const addToCartContainer = document.createElement('div');
  addToCartContainer.classList.add('add-to-cart-container');

  const addToCartButton = document.createElement('button');
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.classList.add('add-to-cart-button');

  // Add to cart logic
  addToCartButton.onclick = () => {
    if (quantityValue > 0) {
      console.log(`Added ${quantityValue} of ${item.title} to the cart.`);
      addItemToLocalStorage(item, quantityValue);
      alert(`${quantityValue} of ${item.title} added to cart.`);
      updateCartUI();
      loadCartData();

      quantityValue = 0;
      quantityDisplay.textContent = quantityValue;
    } else {
      alert('Please add a quantity before adding to the cart.');
    }
  };

  addToCartContainer.appendChild(addToCartButton);

  cardHeader.appendChild(cardTitle);
  cardHeader.appendChild(cardDescription);
  cardHeader.appendChild(cardPrice);

  shop.appendChild(quantityContainer);
  shop.appendChild(addToCartContainer);

  cardBody.appendChild(cardHeader);
  cardBody.appendChild(shop);

  card.appendChild(figure);
  card.appendChild(cardBody);

  cardsContainer.appendChild(card);
};

// Function to update cart section in the UI
function updateCartUI() {
  cartItemsContainer.innerHTML = ''; // Clear current cart items display

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li>Your cart is empty.</li>';
    cartTotalElement.textContent = 'Total: $0';
    return;
  }

  let totalPrice = 0;

  cart.forEach((cartItem) => {
    const cartItemElement = document.createElement('li');
    cartItemElement.textContent = `${cartItem.quantity} x ${
      cartItem.title
    } - $${cartItem.price * cartItem.quantity}`;
    cartItemsContainer.appendChild(cartItemElement);
    totalPrice += cartItem.price * cartItem.quantity;
  });

  cartTotalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Display products in the cards container
const displayProducts = (items) => {
  cardsContainer.innerHTML = '';
  const rowsToShow = parseInt(showRowsFilter.value) || items.length;
  const limitedItems = items.slice(0, rowsToShow);
  limitedItems.forEach(createCard);
};

showRowsFilter.addEventListener('change', () => {
  // Re-display the products whenever the show rows value changes
  buttons.forEach((button) => {
    if (button.classList.contains('active')) {
      // Get the current active category
      const category = button.textContent.toLowerCase();
      let filteredProducts = products;

      // Filter products based on the current category
      if (category !== 'all') {
        filteredProducts = products.filter(product => product.category.toLowerCase() === category);
      }

      displayProducts(filteredProducts); // Display the filtered products
    }
  });
});

// Filter products by category
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.textContent.toLowerCase();
    let filteredProducts = products;

    if (category === 'all') {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === category
      );
    }
    displayProducts(filteredProducts); // Display products based on category selection
  });
});
function loadCartData() {
  // const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.forEach((cartItem) => {
    const matchingCard = document.querySelector(`[data-id="${cartItem.id}"]`);
    if (matchingCard) {
      const quantityDisplay = matchingCard.querySelector('.quantity-display');
      if (quantityDisplay) {
        quantityDisplay.textContent = cartItem.quantity;
      }
    }
  });
}

// Fetch data and display it
const loadData = async () => {
  const data = await fetchData('https://dummyjson.com/c/9671-5bb6-4c72-9073');

  if (data) {
    products = data;
    displayProducts(products);
  }
};


/* cart section */
// Function to update cart section in the UI
function updateCartUI() {
  cartItemsContainer.innerHTML = ''; // Clear current cart items display

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li>Your cart is empty.</li>';
    cartTotalElement.textContent = 'Total: $0.00';
    return;
  }

  let totalHarga = 0; // Initialize total price

  cart.forEach((cartItem) => {
    // Create item container
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');

    // Product Image
    const productImg = document.createElement('div');
    productImg.classList.add('cart-product-img');
    const img = document.createElement('img');
    img.src = cartItem.image; // Assuming each item has an image URL
    img.alt = cartItem.title;
    productImg.appendChild(img);

    // Product Details
    const productDetails = document.createElement('div');
    productDetails.classList.add('cart-product-details');
    const productName = document.createElement('p');
    productName.textContent = cartItem.title;
    const productPrice = document.createElement('p');
    productPrice.textContent = `$${cartItem.price.toFixed(2)}`;
    productDetails.appendChild(productName);
    productDetails.appendChild(productPrice);

    // Quantity Controls
    const quantityControl = document.createElement('div');
    quantityControl.classList.add('cart-quantity');
    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.classList.add('quantity-btn', 'minus');
    const quantityDisplay = document.createElement('span');
    quantityDisplay.classList.add('quantity');
    quantityDisplay.textContent = cartItem.quantity;
    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.classList.add('quantity-btn', 'plus');

    // Update quantity on button click
    decreaseButton.onclick = () => {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
        quantityDisplay.textContent = cartItem.quantity;
        saveCart();
        updateTotalPrice();
      }
    };
    increaseButton.onclick = () => {
      cartItem.quantity++;
      quantityDisplay.textContent = cartItem.quantity;
      saveCart();
      updateTotalPrice();
    };

    quantityControl.appendChild(decreaseButton);
    quantityControl.appendChild(quantityDisplay);
    quantityControl.appendChild(increaseButton);

    cartItemElement.appendChild(productImg);
    cartItemElement.appendChild(productDetails);
    cartItemElement.appendChild(quantityControl);

    cartItemsContainer.appendChild(cartItemElement);

    // Calculate the total price for each item and add to total price
    totalHarga += cartItem.price * cartItem.quantity;
  });

  // Update total price display
  cartTotalElement.textContent = `Total: $${totalHarga.toFixed(2)}`;
}

// Save updated cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update total price when items are added or removed
function updateTotalPrice() {
  let totalHarga = 0;
  cart.forEach((cartItem) => {
    totalHarga += cartItem.price * cartItem.quantity;
  });
  cartTotalElement.textContent = `Total: $${totalHarga.toFixed(2)}`;
}

// Handle Quantity Buttons
document.querySelectorAll('.quantity-btn').forEach(button => {
  button.addEventListener('click', function () {
    const cartItem = this.closest('.cart-item');
    const quantityElement = cartItem.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);

    if (this.classList.contains('plus')) {
      quantity++;
    } else if (this.classList.contains('minus') && quantity > 1) {
      quantity--;
    }

    quantityElement.textContent = quantity;

    // Update subtotal
    updateSubtotal();
  });
});

function updateSubtotal() {
  let subtotal = 0;
  document.querySelectorAll('.cart-item').forEach(item => {
    const priceText = item.querySelector('.cart-product-details p').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const quantity = parseInt(item.querySelector('.quantity').textContent);
    subtotal += price * quantity;
  });
  document.querySelector('.cart-footer p').textContent = 'Subtotal: $' + subtotal.toFixed(2);
}

//end sidebar

//Checkout Button
const checkoutButton = document.querySelector('.checkout-btn');
checkoutButton.addEventListener('click', function() {
  window.location.href = 'order.html';
});
//end button checkout

loadData();
loadCartData();
updateCartUI();
