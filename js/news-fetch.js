function loadNewsByCategory(category) {
  fetch(`https://newsdata.io/api/1/news?apikey=pub_04cb86fce0104c22b0375937e08aed59&language=en&category=${category}&page=1`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('news-container');
      container.innerHTML = ''; // Clear existing content

      if (!data.results || !Array.isArray(data.results)) {
        container.innerHTML = '<p>No news found.</p>';
        return;
      }

      data.results.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${article.image_url || 'https://via.placeholder.com/400x200'}" alt="News Image">
          <div class="card-body">
            <h3 class="card-title">${article.title}</h3>
            <p class="card-text">${article.description || ''}</p>
            <a href="${article.link}" target="_blank">Read more</a>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Failed to fetch news:", error);
      document.getElementById('news-container').innerHTML = '<p>Error loading news. Please try again later.</p>';
    });
}
