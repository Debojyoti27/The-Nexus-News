let currentPage = 1;
let isLoading = false;
let loadedLinks = new Set();  // To track unique articles
const apiKey = "pub_d20111b1ade549b9a3d7daea58d8697f";
const language = "en";

/**
 * Fetch and render news for a given category.
 * @param {string} category
 */
function loadNewsByCategory(category) {
  if (isLoading) return;
  isLoading = true;

  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=${language}&category=${category}&page=${currentPage}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data.results)) {
        console.error("Invalid response:", data);
        return;
      }

      const container = document.getElementById("news-container");
      let newArticlesLoaded = false;

      data.results.forEach((article) => {
        if (!loadedLinks.has(article.link)) {
          loadedLinks.add(article.link);
          newArticlesLoaded = true;

          const card = document.createElement("div");
          card.className = "col-md-4";
          card.innerHTML = `
            <div class="card h-100">
              <img src="${article.image_url || "https://via.placeholder.com/300"}" class="card-img-top" />
              <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description || ""}</p>
                <a href="${article.link}" target="_blank" class="btn btn-primary">Read more</a>
              </div>
            </div>
          `;
          container.appendChild(card);
        }
      });

      if (newArticlesLoaded) currentPage++;
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
    })
    .finally(() => {
      isLoading = false;
    });
}