
let currentCategory = 'top';
let seenArticles = new Set(); // To track duplicate articles

const API_KEY = 'pub_04cb86fce0104c22b0375937e08aed59';
const API_BASE = 'https://newsdata.io/api/1/news';

function loadBreakingNews() {
  fetch(`${API_BASE}?apikey=${API_KEY}&language=en&category=top`)
    .then(res => res.json())
    .then(data => {
      const breaking = data.results?.[0]?.title || "No breaking news available.";
      document.getElementById('breaking-news-text').innerText = breaking;
    })
    .catch(err => {
      console.error("Error loading breaking news:", err);
      document.getElementById('breaking-news-text').innerText = "Unable to load breaking news.";
    });
}

function loadNewsByCategory(category) {
  const url = `${API_BASE}?apikey=${API_KEY}&language=en&page=${currentPage}&category=${category}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('news-container');
      data.results?.forEach(article => {
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
      console.error("Error loading news:", err);
    });
}

// Pagination
function nextPage() {
  currentPage++;
  loadNewsByCategory(currentCategory);
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    seenArticles.clear(); // Reset to allow reloading
    document.getElementById('news-container').innerHTML = '';
    loadNewsByCategory(currentCategory);
  }
}

// Theme toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Init
window.onload = function () {
  const pageName = window.location.pathname.split('/').pop();
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

  currentCategory = categoryMap[pageName] || 'top';
  document.getElementById('news-container').innerHTML = '';
  seenArticles.clear();
  loadBreakingNews();
  loadNewsByCategory(currentCategory);
};
