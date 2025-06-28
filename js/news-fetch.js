let currentCategory = 'top';
let seenArticles = new Set();
let nextPageToken = null;

const API_KEY = 'pub_04cb86fce0104c22b0375937e08aed59';
const API_BASE_URL = 'https://newsdata.io/api/1/news';

function loadNewsByCategory(category) {
  let url = `${API_BASE_URL}?apikey=${API_KEY}&language=en&category=${category}`;
  if (nextPageToken) {
    url += `&page=${nextPageToken}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data.results)) {
        console.error('No valid results received:', data);
        return;
      }

      const container = document.getElementById('news-container');
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
            </div>`;
          container.appendChild(card);
        }
      });

      // Update nextPageToken for next call
      nextPageToken = data.nextPage;
    })
    .catch(err => {
      console.error('Error fetching news:', err);
    });
}

// Detect the current page’s category
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

// Initial Load
function initializePage() {
  currentCategory = detectCategory();
  nextPageToken = null;
  seenArticles.clear();

  const container = document.getElementById('news-container');
  if (container) container.innerHTML = '';

  loadNewsByCategory(currentCategory);
}

// Next Page button support (if needed)
function loadNextPage() {
  if (nextPageToken) {
    loadNewsByCategory(currentCategory);
  }
}

// Run on load
window.onload = initializePage;
