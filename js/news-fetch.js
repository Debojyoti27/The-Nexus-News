// js/news-fetch.js

function loadNewsByCategory(category) {
  const apiKey = "pub_d20111b1ade549b9a3d7daea58d8697f";
  const endpoint = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&category=${category}`;

  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("news-container");
      container.innerHTML = ""; // clear any existing content

      data.results.slice(0, 12).forEach(article => {
        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
          <img src="${article.image_url || 'https://via.placeholder.com/400x200'}" alt="Image" />
          <div class="news-content">
            <h3>${article.title}</h3>
            <p>${article.description || ''}</p>
            <a href="${article.link}" target="_blank">Read more →</a>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error loading news:", error);
    });
}
