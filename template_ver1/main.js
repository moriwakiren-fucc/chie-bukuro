const OWNER = "あなたのGitHubユーザー名";
const REPO  = "リポジトリ名";
const TOKEN = "ghp_xxxxxxxxxxxxxxxxx";

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;

async function submitPost() {
  const title = document.getElementById("title").value || "無題";
  const name = document.getElementById("name").value || "名無し";
  const comment = document.getElementById("comment").value.trim();
  const status = document.getElementById("status");

  if (!comment) {
    status.textContent = "コメントを入力してください";
    return;
  }

  status.textContent = "投稿中…";

  const body = `**${name}**\n\n${comment}`;

  await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Authorization": `token ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      body: body
    })
  });

  status.textContent = "投稿しました";
  document.getElementById("comment").value = "";
  loadPosts();
}

async function loadPosts() {
  const res = await fetch(API_BASE);
  const issues = await res.json();

  const bbs = document.getElementById("bbs");
  bbs.innerHTML = "";

  issues.forEach(issue => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <strong>${issue.title}</strong><br>
      ${issue.body.replace(/\n/g, "<br>")}
    `;
    bbs.appendChild(div);
  });
}

loadPosts();
