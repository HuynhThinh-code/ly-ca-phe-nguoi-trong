const joinScreen = document.querySelector("#joinScreen");
const gameScreen = document.querySelector("#gameScreen");
const joinForm = document.querySelector("#joinForm");
const teamName = document.querySelector("#teamName");
const playerName = document.querySelector("#playerName");
const scoreValue = document.querySelector("#scoreValue");
const comboValue = document.querySelector("#comboValue");
const coinValue = document.querySelector("#coinValue");
const quizProgress = document.querySelector("#quizProgress");
const questionCount = document.querySelector("#questionCount");
const roundTag = document.querySelector("#roundTag");
const questionText = document.querySelector("#questionText");
const answers = document.querySelector("#answers");
const resultStrip = document.querySelector("#resultStrip");
const resultTitle = document.querySelector("#resultTitle");
const answerLine = document.querySelector("#answerLine");

const letters = ["A", "B", "C", "D"];
let playerId = localStorage.getItem("fairBeanPlayerId") || "";
let currentPlayer = null;
let answered = false;
let lastQuestionIndex = -1;

function formatNumber(value) {
  return Number(value || 0).toLocaleString("vi-VN");
}

async function post(path, data = {}) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

function updateDashboard(player) {
  if (!player) return;
  currentPlayer = player;
  playerName.textContent = player.name;
  scoreValue.textContent = formatNumber(player.score);
  comboValue.textContent = `${player.combo || 0}x`;
  coinValue.textContent = formatNumber(player.coins);
}

function findMe(state) {
  return state.players.find((player) => player.id === playerId);
}

function renderLobby(state) {
  questionCount.textContent = "Sảnh chờ";
  roundTag.textContent = `${state.players.length} đội đã vào`;
  questionText.textContent = state.phase === "lobby" ? "Bạn đã vào sảnh. Chờ admin bấm bắt đầu trò chơi." : "Chờ admin chuyển trạng thái.";
  answers.innerHTML = "";
  resultStrip.hidden = true;
}

function renderQuestion(state) {
  const q = state.question;
  if (!q) return;
  if (lastQuestionIndex !== q.index) {
    answered = false;
    lastQuestionIndex = q.index;
  }
  quizProgress.style.width = `${(q.index / q.total) * 100}%`;
  questionCount.textContent = `Câu ${q.index + 1}/${q.total}`;
  roundTag.textContent = q.tag;
  questionText.textContent = q.question;
  resultStrip.hidden = true;
  answers.innerHTML = "";
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.dataset.letter = letters[index];
    button.textContent = option;
    button.disabled = answered || currentPlayer?.currentAnswer !== null;
    button.addEventListener("click", async () => {
      answered = true;
      button.classList.add("is-picked");
      [...answers.children].forEach((child) => (child.disabled = true));
      await post("/api/answer", { id: playerId, choice: index });
      resultStrip.hidden = false;
      resultTitle.textContent = "Đã khóa đáp án";
      answerLine.textContent = `Bạn chọn ${letters[index]}. Chờ admin hiện kết quả.`;
    });
    if (currentPlayer?.currentAnswer === index) button.classList.add("is-picked");
    answers.append(button);
  });
}

function renderReveal(state) {
  renderQuestion(state);
  const q = state.question;
  const me = findMe(state);
  const selected = me?.currentAnswer;
  [...answers.children].forEach((button, index) => {
    button.disabled = true;
    if (index === q.answer) button.classList.add("is-correct");
    if (selected === index && selected !== q.answer) button.classList.add("is-wrong");
  });
  resultStrip.hidden = false;
  if (selected === q.answer) {
    resultTitle.textContent = "Đúng!";
    answerLine.textContent = `Đáp án: ${letters[q.answer]} · ${q.options[q.answer]}`;
  } else {
    resultTitle.textContent = selected == null ? "Chưa trả lời" : "Sai rồi";
    answerLine.textContent = `Đáp án đúng: ${letters[q.answer]} · ${q.options[q.answer]}`;
  }
}

function renderScoreboard(state) {
  renderReveal(state);
  const me = findMe(state);
  const rank = state.scoreboard.find((player) => player.id === playerId)?.rank;
  resultTitle.textContent = state.phase === "finished" ? "Kết thúc game" : `Bảng điểm: hạng ${rank || "-"}`;
  answerLine.textContent = me ? `${me.name}: ${formatNumber(me.score)} điểm · ${me.coins} coin` : "Chờ admin bắt đầu vòng mới.";
}

function applyState(state) {
  const me = findMe(state);
  if (me) updateDashboard(me);
  if (!playerId || !me) return;
  if (state.phase === "lobby") renderLobby(state);
  if (state.phase === "question") renderQuestion(state);
  if (state.phase === "reveal") renderReveal(state);
  if (state.phase === "scoreboard" || state.phase === "finished") renderScoreboard(state);
}

joinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = await post("/api/join", { id: playerId, name: teamName.value });
  playerId = data.player.id;
  localStorage.setItem("fairBeanPlayerId", playerId);
  updateDashboard(data.player);
  joinScreen.hidden = true;
  gameScreen.hidden = false;
});

if (playerId) {
  post("/api/join", { id: playerId, name: localStorage.getItem("fairBeanPlayerName") || "" }).then((data) => {
    if (data.player) {
      joinScreen.hidden = true;
      gameScreen.hidden = false;
      updateDashboard(data.player);
    }
  });
}

teamName.addEventListener("input", () => {
  localStorage.setItem("fairBeanPlayerName", teamName.value);
});

const events = new EventSource("/api/events");
events.onmessage = (event) => applyState(JSON.parse(event.data));
