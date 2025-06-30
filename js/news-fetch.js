let currentPage = 1;
let isLoading = false;
let totalPages = 1; // Will be set dynamically
const API_KEY = 'pub_04cb86fce0104c22b0375937e08aed59';

// Map page name to category
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

const currentFile = window.location.pathname.split('/').pop();
const currentCategory = categoryMap[currentFile] || 'top';

function loadNewsByCategory(category) {
  if (isLoading || currentPage > totalPages) return;

  isLoading = true;
  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&category=${category}&page=${currentPage}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('news-container');

      // Handle API error
      if (data.status === 'error' || !Array.isArray(data.results)) {
        container.innerHTML = `<div class="col-12 text-center text-danger">⚠️ Unable to load news.</div>`;
        document.getElementById('loadMoreBtn')?.classList.add('d-none');
        return;
      }

      totalPages = data.totalPages || 1; // Use totalPages if available

      data.results.forEach(article => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
          <div class="card h-100">
            ${article.image_url ? `<img src="${article.image_url}" class="card-img-top" alt="news image">` : ''}
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description || ''}</p>
              <a href="${article.link}" target="_blank" class="btn btn-primary">Read more</a>
            </div>
          </div>`;
        container.appendChild(card);
      });

      currentPage++;
      if (currentPage > totalPages) {
        document.getElementById('loadMoreBtn')?.classList.add('d-none');
      }

      isLoading = false;
    })
    .catch(error => {
      console.error("News fetch error:", error);
      isLoading = false;
    });
}

window.onload = () => {
  loadNewsByCategory(currentCategory);
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => loadNewsByCategory(currentCategory));
  }
};
