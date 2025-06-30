let nextPageToken = null;
let isLoading = false;

// 🔁 Mapping filenames to API categories
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

// ✅ Get current file and category
const currentFile = window.location.pathname.split('/').pop();
const currentCategory = categoryMap[currentFile] || 'top';

// 📰 Load news
function loadNewsByCategory(category) {
  if (isLoading) return;
  isLoading = true;

  let url = `https://newsdata.io/api/1/news?apikey=pub_04cb86fce0104c22b0375937e08aed59&language=en&category=${category}`;
  if (nextPageToken) {
    url += `&page=${nextPageToken}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('news-container');
      if (!Array.isArray(data.results)) {
        console.warn("No valid news received", data);
        isLoading = false;
        return;
      }

      data.results.forEach(article => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            ${article.image_url ? `<img src="${article.image_url}" class="card-img-top" alt="News image">` : ''}
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description || ''}</p>
              <a href="${article.link}" target="_blank" class="btn btn-primary">Read more</a>
            </div>
          </div>`;
        container.appendChild(card);
      });

      // ✅ Update nextPage token
      nextPageToken = data.nextPage || null;
      if (!nextPageToken) {
        const btn = document.getElementById('load-more-btn');
        if (btn) btn.style.display = 'none';
      }

      isLoading = false;
    })
    .catch(err => {
      console.error("Failed to fetch news:", err);
      isLoading = false;
    });
}

// 🟢 Attach Load More button
function setupLoadMoreButton() {
  const btn = document.getElementById('load-more-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      loadNewsByCategory(currentCategory);
    });
  }
}

// 🚀 Initialize
window.onload = () => {
  loadNewsByCategory(currentCategory);
  setupLoadMoreButton();
};
