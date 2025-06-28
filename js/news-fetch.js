function loadNewsByCategory(category) {
  const apiKey = "pub_04cb86fce0104c22b0375937e08aed59"; // Your working API key
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&category=${category}&page=1`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("news-container");
      container.innerHTML = ""; // Clear previous news

      if (!data.results || !Array.isArray(data.results)) {
        container.innerHTML = "<p>No news found.</p>";
        return;
      }

      data.results.forEach((article) => {
        const card = document.createElement("div");
        card.className = "col-md-4";
        card.innerHTML = `
          <div class="card h-100">
            <img src="${article.image_url || 'https://via.placeholder.com/400x200'}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description || ''}</p>
              <a href="${article.link}" target="_blank" class="btn btn-primary">Read more</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Failed to fetch news:", err);
      document.getElementById("news-container").innerHTML = "<p>Error loading news.</p>";
    });
}
