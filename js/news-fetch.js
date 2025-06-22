const apiKey = "pub_04cb86fce0104c22b0375937e08aed59";
const language = "en";
let loadedLinks = new Set();

function loadNewsByCategory(category) {
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=${language}&category=${category}&page=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data.results)) {
        console.error("Invalid data format", data);
        return;
      }

      const container = document.getElementById("news-container");

      data.results.forEach(article => {
        if (!loadedLinks.has(article.link)) {
          loadedLinks.add(article.link);

          const card = document.createElement("div");
          card.className = "col-md-4";
          card.innerHTML = `
            <div class="card h-100">
              <img src="${article.image_url || 'https://via.placeholder.com/300'}" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description || ''}</p>
                <a href="${article.link}" target="_blank" class="btn btn-primary">Read more</a>
              </div>
            </div>
          `;
          container.appendChild(card);
        }
      });
    })
    .catch(err => console.error("Error fetching news:", err));
}