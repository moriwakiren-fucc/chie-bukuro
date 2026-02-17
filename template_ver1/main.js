const GAS_URL = "https://script.google.com/macros/s/AKfycbygMWL_WIhglJ_PnzNYVq0_NIeYOw9FJEmaMojroWWjkc7EqmVtmmVYUK0pTvZHU76w/exec";

async function loadPosts() {
  const bbs = document.getElementById("bbs");
  const loading = document.getElementById("loading");

  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();

    if (!json.data || json.data.length === 0) {
      bbs.textContent = "まだ投稿がありません";
      return;
    }

    bbs.innerHTML = "";

    json.data.forEach(row => {
      const div = document.createElement("div");
      div.className = "post";

      const date = new Date(row[0]).toLocaleString();

      div.innerHTML = `
        <div class="date">${date}</div>
        <div class="title">${escapeHtml(row[1])}</div>
        <div class="name">${escapeHtml(row[2])}</div>
        <div class="comment">
          ${escapeHtml(row[3]).replace(/\n/g, "<br>")}
        </div>
      `;

      bbs.appendChild(div);
    });

  } catch (e) {
    bbs.textContent = "表示エラーが発生しました";
    console.error(e);
  } finally {
    // ★ 読み込み完了後にローディングを消す
    loading.style.display = "none";
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadPosts();
