const currentFile = window.location.pathname.split('/').pop();
const currentCategory = detectCategory[currentFile] ;
let seenArticles = new Set();
let nextPageToken = null;
function detectCategory() {
  const page = window.location.pathname.split('/').pop();
  const map = {
    'index.html': 'top',
    'tech-page.html': 'technology',
    'startups-page.html': 'business',
    'sports-page.html': 'sports',
    'health-page.html': 'health',
    'environment-page.html': 'environment',
    'world-page.html': 'world',
    'entertainment-page.html': 'entertainment'
  };
const API_KEY = 'pub_04cb86fce0104c22b0375937e08aed59';
const API_BASE_URL = 'https://newsdata.io/api/1/news';

function fetchNews(pageToken = null) {
  let url = `${API_BASE_URL}?apikey=${API_KEY}&language=en&category=${currentCategory}`;
  if (pageToken) url += `&page=${pageToken}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data.results)) {
        console.error('Invalid data:', data);
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
              <img src="${article.image_url || 'https://via.placeholder.com/300'}" class="card-img-top" alt="News Image">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description || ''}</p>
                <a href="${article.link}" target="_blank" class="btn btn-primary mt-auto">Read more</a>
              </div>
            </div>`;
          container.appendChild(card);
        }
      });

      // Set next page token and show/hide "Load More"
      nextPageToken = data.nextPage || null;
      document.getElementById('loadMoreBtn').style.display = nextPageToken ? 'block' : 'none';
    })
    .catch(err => {
      console.error('News fetch failed:', err);
    });
}

function initializePage() {
  currentCategory = detectCategory();
  seenArticles.clear();
  document.getElementById('news-container').innerHTML = '';
  fetchNews();
}


  return map[page] || 'top';
}

document.addEventListener('DOMContentLoaded', () => {
  initializePage();
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    if (nextPageToken) fetchNews(nextPageToken);
  });
});
