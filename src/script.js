const cardsContainer = document.querySelector('.cards-container');
const buttons = document.querySelectorAll('.filter-button button');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total');
const showRowsFilter = document.getElementById('showRows');
const cartSidebar = document.getElementById('cartSidebar');
const orderButton = document.getElementById('order-button');

let products = [];
let currentCategory = 'all';

const cart = JSON.parse(localStorage.getItem('cart')) || [];

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

  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += quantity;

  } else {
    cart.push({ ...item, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
};

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
  decreaseButton.classList.add('quantity-btn');

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
  increaseButton.classList.add('quantity-btn');

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

// Update cart section in the UI
function updateCartUI() {
  cartItemsContainer.innerHTML = ''; 

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

// Display products in the cards 
const displayProducts = (items) => {
  cardsContainer.innerHTML = '';
  const rowsToShow = parseInt(showRowsFilter.value) || items.length;
  const limitedItems = items.slice(0, rowsToShow);
  limitedItems.forEach(createCard);
};

showRowsFilter.addEventListener('change', () => {
  
  buttons.forEach((button) => {
    if (button.classList.contains('active')) {
      
      const category = button.textContent.toLowerCase();
      let filteredProducts = products;

      
      if (category !== 'all') {
        filteredProducts = products.filter(
          (product) => product.category.toLowerCase() === category
        );
      }

      displayProducts(filteredProducts); 
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
    displayProducts(filteredProducts); 
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

// Fetch data and display
const loadData = async () => {
  const data = await fetchData('https://dummyjson.com/c/9671-5bb6-4c72-9073');

  if (data) {
    products = data;
    displayProducts(products);
  }
};

// Toggle cart sidebar
function toggleCartSidebar() {
  cartSidebar.classList.toggle('active');

  if (cartSidebar.classList.contains('active')) {
    window.addEventListener('click', handleWindowClick);

  } else {
    window.removeEventListener('click', handleWindowClick);
  }
}

// Window clicks
function handleWindowClick(event) {
  const cartSidebar = document.getElementById('cartSidebar');
  const orderButton = document.getElementById('order-button');

  if (!cartSidebar.contains(event.target) && event.target !== orderButton) {
    toggleCartSidebar();
  }
}

document
  .getElementById('order-button')
  .addEventListener('click', function (event) {
    event.preventDefault(); 
    event.stopPropagation(); 
    toggleCartSidebar();
  });

// CSS for the sidebar
const style = document.createElement('style');
style.textContent = `
  .cart-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10;
  position: fixed;
  top: 82.7px;
  right: -400px;
  width: 400px;
  height: calc(100% - 80px);
  padding: 30px;
  background-color: #282425;
  transition: right 0.3s ease-in-out;
  z-index: 999;
  padding: 20px;
  box-sizing: border-box;
}

  .cart-sidebar.active {
    right: 0;
  }
`;
document.head.appendChild(style);

/* cart section */

function updateCartUI() {
  cartItemsContainer.innerHTML = ''; 

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li>Your cart is empty.</li>';
    cartTotalElement.textContent = 'Total: $0.00';
    return;
  }

  let totalHarga = 0;

  cart.forEach((cartItem) => {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');

    const productImg = document.createElement('div');
    productImg.classList.add('cart-product-img');
    const img = document.createElement('img');
    img.src = cartItem.image; 
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

    // Update quantity on button
    decreaseButton.onclick = () => {
      if (cartItem.quantity === 1) {
        if (cartSidebar.classList.contains('active')) {
          cartSidebar.classList.toggle('active');
        }
        const itemIndex = cart.findIndex(
          (cartItem) => cartItem.id === cartItem.id
        );
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartUI();
      }
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

    totalHarga += cartItem.price * cartItem.quantity;
  });

  cartTotalElement.textContent = `Total: $${totalHarga.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateTotalPrice() {
  let totalHarga = 0;
  let totalProduct = 0;
  cart.forEach((cartItem) => {
    totalHarga += cartItem.price * cartItem.quantity;
    totalProduct += cartItem.quantity;
  });
  // Update total price and item count
  cartTotalElement.textContent = `Total: $${totalHarga.toFixed(
    2
  )} (${totalProduct} items)`;
}

//Checkout Button
const checkoutButton = document.querySelector('.checkout-btn');
checkoutButton.addEventListener('click', function () {
  window.location.href = 'order.html';
});

loadData();
loadCartData();
updateCartUI();
