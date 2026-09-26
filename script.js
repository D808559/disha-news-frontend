const BACKEND_URL = "https://disha-news-backend.onrender.com";
const container = document.getElementById("news-container");
const buttons = document.querySelectorAll(".categories button");

async function loadNews(category) {
  container.innerHTML = "<p>समाचार लोड हो रहे हैं...</p>";
  try {
    const res = await fetch(`${BACKEND_URL}/api/news?cat=${encodeURIComponent(category)}`);
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
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${article.title || ""}</h2>
        <p>${article.description || ""}</p>
        <div class="meta">${article.source || ""}</div>
        <a href="${article.url}" target="_blank">पूरा पढ़ें →</a>
      `;
      container.appendChild(card);
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

const activeCategory = document.querySelector(".categories button.active");
loadNews(activeCategory?.dataset.cat || "india");
