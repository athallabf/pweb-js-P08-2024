const cardsContainer = document.querySelector('.cards-container');

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

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = item.title; // Assuming 'name' is part of your fetched data

  const cardDescription = document.createElement('p');
  cardDescription.textContent = item.shortDescription; // Assuming 'description' is part of your fetched data

  // Append title and description to card body
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardDescription);

  // Append figure and card body to the card
  card.appendChild(figure);
  card.appendChild(cardBody);

  // Append the newly created card to the cards container
  cardsContainer.appendChild(card);
};

// Fetch data and process it
const loadData = async () => {
  const data = await fetchData('https://dummyjson.com/c/1ad0-3982-4917-8224'); // Replace with your actual URL

  // Iterate through the fetched data and create cards if the data is valid
  if (data) {
    for (const item of data) {
      createCard(item);
    }
  }
};

// Load data when the page is ready
loadData();
