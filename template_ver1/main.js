const GAS_URL = "ここにGASのWebアプリURL";

async function submitPost() {
  const title = titleEl().value;
  const name = nameEl().value || "名無し";
  const comment = commentEl().value.trim();
  const status = statusEl();

  if (!comment) {
    status.textContent = "コメント必須";
    return;
  }

  status.textContent = "投稿中…";

  await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({ title, name, comment })
  });

  status.textContent = "投稿しました";
  commentEl().value = "";
  loadPosts();
}

async function loadPosts() {
  const res = await fetch(GAS_URL);
  const json = await res.json();

  const bbs = document.getElementById("bbs");
  bbs.innerHTML = "";

  json.data.forEach(row => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="date">${new Date(row[0]).toLocaleString()}</div>
      <div class="title">${escape(row[1])}</div>
      <div class="name">${escape(row[2])}</div>
      <div class="comment">${escape(row[3]).replace(/\n/g,"<br>")}</div>
    `;
    bbs.appendChild(div);
  });
}

function escape(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

// DOM短縮
const titleEl = () => document.getElementById("title");
const nameEl = () => document.getElementById("name");
const commentEl = () => document.getElementById("comment");
const statusEl = () => document.getElementById("status");

loadPosts();
