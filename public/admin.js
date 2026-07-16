const adminPhase = document.querySelector("#adminPhase");
const adminPlayers = document.querySelector("#adminPlayers");
const adminRound = document.querySelector("#adminRound");
const adminAnswered = document.querySelector("#adminAnswered");
const lobbyPlayers = document.querySelector("#lobbyPlayers");
const adminQuestionTitle = document.querySelector("#adminQuestionTitle");
const adminQuestionText = document.querySelector("#adminQuestionText");
const adminOptions = document.querySelector("#adminOptions");
const answerBuckets = document.querySelector("#answerBuckets");
const scoreboardList = document.querySelector("#scoreboardList");
const startGame = document.querySelector("#startGame");
const revealAnswers = document.querySelector("#revealAnswers");
const showScoreboard = document.querySelector("#showScoreboard");
const nextQuestion = document.querySelector("#nextQuestion");
const resetGame = document.querySelector("#resetGame");
const letters = ["A", "B", "C", "D"];

function phaseLabel(phase) {
  return {
    lobby: "Sảnh chờ",
    question: "Đang trả lời",
    reveal: "Đã hiện đáp án",
    scoreboard: "Bảng điểm",
    finished: "Kết thúc",
  }[phase] || phase;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

async function post(path) {
  await fetch(path, { method: "POST" });
}

function renderPlayers(players) {
  lobbyPlayers.innerHTML = "";
  if (!players.length) {
    lobbyPlayers.innerHTML = `<p class="empty-note">Chưa có đội nào vào sảnh.</p>`;
    return;
  }
  players.forEach((player) => {
    const card = document.createElement("article");
    card.className = "player-pill";
    card.innerHTML = `<strong>${player.name}</strong><span>${formatNumber(player.score)} điểm · ${player.correct || 0} đúng</span>`;
    lobbyPlayers.append(card);
  });
}

function renderQuestion(state) {
  const q = state.question;
  if (!q) {
    adminQuestionTitle.textContent = "Chờ bắt đầu";
    adminQuestionText.textContent = "Khi các nhóm đã vào sảnh, bấm bắt đầu trò chơi.";
    adminOptions.innerHTML = "";
    return;
  }
  adminQuestionTitle.textContent = `Câu ${q.index + 1}/${q.total} · ${q.tag}`;
  adminQuestionText.textContent = q.question;
  adminOptions.innerHTML = "";
  q.options.forEach((option, index) => {
    const div = document.createElement("div");
    div.className = "admin-option";
    if (state.phase !== "question" && q.answer === index) div.classList.add("is-correct");
    div.innerHTML = `<strong>${letters[index]}</strong><span>${option}</span>`;
    adminOptions.append(div);
  });
}

function renderBuckets(state) {
  const q = state.question;
  answerBuckets.innerHTML = "";
  const buckets = [0, 1, 2, 3].map((index) => ({
    index,
    players: state.answers.byPlayer.filter((player) => player.answer === index),
  }));
  buckets.push({ index: null, players: state.answers.byPlayer.filter((player) => player.answer === null) });

  buckets.forEach((bucket) => {
    const card = document.createElement("article");
    card.className = "answer-bucket";
    if (q && state.phase !== "question" && bucket.index === q.answer) card.classList.add("is-correct");
    const title = bucket.index === null ? "Chưa chọn" : letters[bucket.index];
    card.innerHTML = `<strong>${title}</strong><span>${bucket.players.length} đội</span><div></div>`;
    const list = card.querySelector("div");
    bucket.players.forEach((player) => {
      const chip = document.createElement("small");
      chip.textContent = player.name;
      list.append(chip);
    });
    answerBuckets.append(card);
  });
}

function renderScoreboard(state) {
  scoreboardList.innerHTML = "";
  if (!state.scoreboard.length) {
    scoreboardList.innerHTML = `<p class="empty-note">Chưa có điểm.</p>`;
    return;
  }
  state.scoreboard.forEach((player) => {
    const row = document.createElement("article");
    row.className = "score-row";
    row.innerHTML = `
      <span>${player.rank}</span>
      <strong>${player.name}</strong>
      <em>${formatNumber(player.score)} điểm</em>
      <small>${player.correct || 0} đúng · ${player.coins || 0} coin</small>
    `;
    scoreboardList.append(row);
  });
}

function updateButtons(state) {
  startGame.disabled = state.phase !== "lobby" || state.players.length === 0;
  revealAnswers.disabled = state.phase !== "question";
  showScoreboard.disabled = state.phase !== "reveal";
  nextQuestion.disabled = state.phase !== "scoreboard";
}

function applyState(state) {
  const answered = state.answers.byPlayer.filter((player) => player.answer !== null).length;
  adminPhase.textContent = phaseLabel(state.phase);
  adminPlayers.textContent = state.players.length;
  adminRound.textContent = state.phase === "lobby" ? `0/${state.totalQuestions}` : `${state.questionIndex + 1}/${state.totalQuestions}`;
  adminAnswered.textContent = `${answered}/${state.players.length}`;
  renderPlayers(state.players);
  renderQuestion(state);
  renderBuckets(state);
  renderScoreboard(state);
  updateButtons(state);
}

startGame.addEventListener("click", () => post("/api/start"));
revealAnswers.addEventListener("click", () => post("/api/reveal"));
showScoreboard.addEventListener("click", () => post("/api/scoreboard"));
nextQuestion.addEventListener("click", () => post("/api/next"));
resetGame.addEventListener("click", () => {
  if (confirm("Reset phòng chơi và xóa danh sách người chơi?")) post("/api/reset");
});

const events = new EventSource("/api/events");
events.onmessage = (event) => applyState(JSON.parse(event.data));
