const BACKEND_URL = "https://disha-news-backend.onrender.com";
const container = document.getElementById("news-container");
const buttons = document.querySelectorAll(".categories button");

const API_CATEGORIES = {
  "भारत": "india",
  "व्यापार": "business",
  "तकनीक": "technology",
  "खेल": "sports",
};

function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = "card";

  if (typeof article.image === "string" && article.image.startsWith("data:image/")) {
    const image = document.createElement("img");
    image.className = "card-image";
    image.src = article.image;
    image.alt = article.title || "समाचार चित्र";
    image.loading = "lazy";
    card.appendChild(image);
  }

  const title = document.createElement("h2");
  title.textContent = article.title || "";
  card.appendChild(title);

  const description = document.createElement("p");
  description.textContent = article.description || "";
  card.appendChild(description);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = article.source || "";
  card.appendChild(meta);

  if (article.url) {
    const link = document.createElement("a");
    link.href = article.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "पूरा पढ़ें →";
    card.appendChild(link);
  }

  return card;
}

async function loadNews(category) {
  container.innerHTML = "<p>समाचार लोड हो रहे हैं...</p>";
  try {
    const apiCategory = API_CATEGORIES[category] || category;
    const res = await fetch(`${BACKEND_URL}/api/news?cat=${encodeURIComponent(apiCategory)}`);

    if (!res.ok) {
      throw new Error(`News API returned ${res.status}`);
    }

    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>अभी कोई समाचार उपलब्ध नहीं है।</p>";
      return;
    }

    container.innerHTML = "";
    data.articles.forEach(article => {
      container.appendChild(createArticleCard(article));
    });
  } catch (err) {
    container.innerHTML = "<p>समाचार लोड करने में समस्या हुई।</p>";
  }
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadNews(btn.dataset.cat);
  });
});

loadNews("भारत");
