const cardsContainer = document.querySelector('.cards-container');
const buttons = document.querySelectorAll('.filter-button button');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total');

// Initialize an array to hold fetched products
let products = [];

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
  items.forEach(createCard);
};

// Filter products by category
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.textContent.toLowerCase();
    if (category === 'all') {
      displayProducts(products);
    } else {
      const filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === category
      );
      displayProducts(filteredProducts);
    }
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
  const data = await fetchData('https://dummyjson.com/c/6551-c288-4660-b66f');

  if (data) {
    products = data;
    displayProducts(products);
  }
};

loadData();
loadCartData();
updateCartUI();
