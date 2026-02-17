const GAS_URL = "https://script.google.com/macros/s/AKfycbygMWL_WIhglJ_PnzNYVq0_NIeYOw9FJEmaMojroWWjkc7EqmVtmmVYUK0pTvZHU76w/exec";

/* 投稿読み込み */
async function loadPosts() {
  const bbs = document.getElementById("bbs");
  const loading = document.getElementById("loading");

  try {
    const res = await fetch(GAS_URL);
    const json = await res.json();

    bbs.innerHTML = "";

    if (!json.data || json.data.length === 0) {
      bbs.textContent = "まだ投稿がありません";
      return;
    }

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
    loading.style.display = "none";
  }
}

/* ★ 投稿処理（新規追加） */
async function submitPost() {
  const status = document.getElementById("status");
  status.textContent = "送信中…";

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        title: "test",
        name: "debug",
        comment: "hello"
      })
    });

    const text = await res.text();
    console.log("HTTP status:", res.status);
    console.log("Raw response:", text);

    status.textContent = "通信成功（Console参照）";

  } catch (e) {
    console.error("通信エラー詳細:", e);
    status.textContent = "通信エラー";
  }
}

/* HTMLエスケープ */
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadPosts();
