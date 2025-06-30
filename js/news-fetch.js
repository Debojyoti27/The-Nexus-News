let currentPage = 1;
let isLoading = false;
const API_KEY = 'pub_04cb86fce0104c22b0375937e08aed59';

// Detect current category from page name
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

const currentPageFile = window.location.pathname.split('/').pop();
const currentCategory = categoryMap[currentPageFile] || 'top';

function loadNewsByCategory(category) {
  if (isLoading) return;

  isLoading = true;
  const apiUrl = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&category=${category}&page=${currentPage}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (!data.results || !Array.isArray(data.results)) {
        document.getElementById('news-container').innerHTML = `
          <div class="col-12 text-danger text-center">❌ Failed to load news. Try again later.</div>`;
        document.getElementById('loadMoreBtn')?.classList.add('d-none');
        return;
      }

      const container = document.getElementById('news-container');

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
              <div class="mt-2">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.link)}" target="_blank" class="btn btn-sm btn-info text-white me-1">Tweet</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.link)}" target="_blank" class="btn btn-sm btn-primary text-white">Share</a>
              </div>
            </div>
          </div>`;
        container.appendChild(card);
      });

      currentPage++; // Increment for next fetch
      isLoading = false;
    })
    .catch(error => {
      console.error("Error loading news:", error);
      isLoading = false;
    });
}

// Initialize when page loads
window.onload = () => {
  loadNewsByCategory(currentCategory);

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => loadNewsByCategory(currentCategory));
  }
};
