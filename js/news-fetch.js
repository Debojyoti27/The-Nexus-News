let currentPage = 1;
let isLoading = false;

// 🔁 Mapping page filenames to category names
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

// ✅ Get the current filename
const currentFile = window.location.pathname.split('/').pop();
const currentCategory = categoryMap[currentFile] || 'top';

function loadNewsByCategory(category) {
  if (isLoading) return;
  isLoading = true;

  fetch(`https://newsdata.io/api/1/news?apikey=pub_d20111b1ade549b9a3d7daea58d8697f&language=en&page=${currentPage}&category=${category}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('news-container');

      if (!Array.isArray(data.results)) {
        console.error("No valid results:", data);
        isLoading = false;
        return;
      }

      data.results.forEach(article => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
          <div class="card h-100">
            ${article.image_url ? `<img src="${article.image_url}" class="card-img-top">` : ''}
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description || ''}</p>
              <a href="${article.link}" target="_blank" class="btn btn-primary">Read more</a>
            </div>
          </div>`;
        container.appendChild(card);
      });

      isLoading = false;
      currentPage++;
    })
    .catch(err => {
      console.error("Failed to fetch news:", err);
      isLoading = false;
    });
}

// 🟢 Initialize on load
window.onload = () => {
  loadNewsByCategory(currentCategory);
};
