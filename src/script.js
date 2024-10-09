const cardsContainer = document.querySelector('.cards-container');
const buttons = document.querySelectorAll('.filter-button button');

let products = []; // Initialize an array to hold fetched products

// Fetch data from the given URL
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data; // Ensure data is returned
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Function to create a card element based on an item
const createCard = (item) => {
  // Create the card container
  const card = document.createElement('div');
  card.classList.add('card');

  // Create the figure element with image
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = item.image; // Assuming 'image' is part of your fetched data
  img.alt = item.name; // Assuming 'name' is part of your fetched data
  figure.appendChild(img);

  // Create the card body
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');

  // Title
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = item.title; // Assuming 'title' is part of your fetched data

  // Description
  const cardDescription = document.createElement('p');
  cardDescription.textContent = item.shortDescription; // Assuming 'shortDescription' is part of your fetched data

  // Price
  const cardPrice = document.createElement('p');
  cardPrice.classList.add('card-price');
  cardPrice.textContent = `$${item.price}`; // Assuming 'price' is part of your fetched data

  const shop = document.createElement('div');
  shop.classList.add('shop');

  // Quantity Control
  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('quantity-container');

  // Decrease button
  const decreaseButton = document.createElement('button');
  decreaseButton.textContent = '-';
  decreaseButton.classList.add('quantity-button');
  decreaseButton.onclick = () => {
    if (quantityValue > 0) {
      quantityValue--;
      quantityDisplay.textContent = quantityValue;
    }
  };

  // Quantity display
  const quantityDisplay = document.createElement('span');
  quantityDisplay.textContent = '0'; // Initialize quantity to 0
  let quantityValue = 0; // Track quantity value

  // Increase button
  const increaseButton = document.createElement('button');
  increaseButton.textContent = '+';
  increaseButton.classList.add('quantity-button');
  increaseButton.onclick = () => {
    quantityValue++;
    quantityDisplay.textContent = quantityValue;
  };

  // Add buttons to the quantity container
  quantityContainer.appendChild(decreaseButton);
  quantityContainer.appendChild(quantityDisplay);
  quantityContainer.appendChild(increaseButton);

  // add to crt continer
  const addToCartContainer = document.createElement('div');
  addToCartContainer.classList.add('add-to-cart-container');

  // Add to Cart button
  const addToCartButton = document.createElement('button');
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.classList.add('add-to-cart-button');
  addToCartButton.onclick = () => {
    if (quantityValue > 0) {
      // Simulate adding to cart (you can implement your own logic)
      console.log(`Added ${quantityValue} of ${item.title} to the cart.`);
      
      // Reset quantity display and value
      quantityValue = 0;
      quantityDisplay.textContent = quantityValue;
    } else {
      alert('Please add a quantity before adding to the cart.');
    }
  };

  // append add to cart button
  addToCartContainer.appendChild(addToCartButton);

  // Append title, description, price, quantity controls, and add to cart button to card body
  cardHeader.appendChild(cardTitle);
  cardHeader.appendChild(cardDescription);
  cardHeader.appendChild(cardPrice);

  shop.appendChild(quantityContainer);
  shop.appendChild(addToCartContainer); 

  cardBody.appendChild(cardHeader);
  cardBody.appendChild(shop);
  

  // Append figure and card body to the card
  card.appendChild(figure);
  card.appendChild(cardBody);


  // Append the newly created card to the cards container
  cardsContainer.appendChild(card);
};



// Function to display products in the cards container
const displayProducts = (items) => {
  cardsContainer.innerHTML = ''; // Clear existing cards
  items.forEach(createCard); // Create a card for each item
};

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.textContent.toLowerCase();
    if (category === 'all') {
      displayProducts(products); // Show all products
    } else {
      const filteredProducts = products.filter(product => product.category.toLowerCase() === category);
      displayProducts(filteredProducts); // Display filtered products
    }
  });
});

// Fetch data and process it
const loadData = async () => {
  const data = await fetchData('https://dummyjson.com/c/6551-c288-4660-b66f'); 

  if (data) {
    products = data; // Store fetched data in products array
    displayProducts(products); // Initially display all products
  }
};

loadData();
