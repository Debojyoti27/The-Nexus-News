let currentPage = 1;
let currentCategory = 'top';
const seenArticles = new Set();

const API_KEY = 'pub_04cb86fce0104c22b0375937e08aed59';
const API_BASE_URL = 'https://newsdata.io/api/1/news';

function loadNewsByCategory(category) {
  const container = document.getElementById('news-container');
  const url = `${API_BASE_URL}?apikey=${API_KEY}&language=en&category=${category}&page=${currentPage}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data.results)) {
        console.error('Invalid or missing results in response:', data);
        return;
      }

      data.results.forEach(article => {
        if (!seenArticles.has(article.title)) {
          seenArticles.add(article.title);

          const card = document.createElement('div');
          card.className = 'col-md-4';
          card.innerHTML = `
            <div class="card h-100 shadow-sm">
              <img src="${article.image_url || 'https://via.placeholder.com/300'}" class="card-img-top" alt="news image">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description || ''}</p>
                <a href="${article.link}" target="_blank" class="btn btn-primary mt-auto">Read more</a>
              </div>
            </div>
          `;
          container.appendChild(card);
        }
      });
    })
    .catch(err => {
      console.error('Error fetching news:', err);
    });
}

// Detect current category from page
function detectCategory() {
  const path = window.location.pathname.split('/').pop();
  const categoryMap = {
    'index.html': 'top',
    'tech-page.html': 'technology',
    'startups-page.html': 'business',
    'sports-page.html': 'sports',
    'health-page.html': 'health',
    'environment-page.html': 'environment',
    'world-page.html': 'world',
    'entertainment-page.html': 'entertainment'
  };
  return categoryMap[path] || 'top';
}

// Initializer
function initializePage() {
  currentCategory = detectCategory();
  currentPage = 1;
  seenArticles.clear();

  const container = document.getElementById('news-container');
  if (container) container.innerHTML = '';

  loadNewsByCategory(currentCategory);
}

// For pagination buttons (if any)
function nextPage() {
  currentPage++;
  loadNewsByCategory(currentCategory);
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    seenArticles.clear();
    const container = document.getElementById('news-container');
    if (container) container.innerHTML = '';
    loadNewsByCategory(currentCategory);
  }
}

// Theme toggle (optional)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Run on page load
window.onload = initializePage;
