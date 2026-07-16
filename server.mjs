import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 3000);
const publicDir = join(process.cwd(), "public");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

const questions = [
  {
    tag: "Khái niệm",
    question: "Lợi ích kinh tế được hiểu gần nhất là gì?",
    options: [
      "Lợi ích vật chất thu được khi tham gia hoạt động kinh tế",
      "Sở thích cá nhân không liên quan đến sản xuất",
      "Một khẩu hiệu đạo đức dùng để kêu gọi chia sẻ",
      "Chỉ là lợi nhuận của doanh nghiệp",
    ],
    answer: 0,
  },
  {
    tag: "Khái niệm",
    question: "Quan hệ lợi ích kinh tế là quan hệ giữa các chủ thể trong quá trình nào?",
    options: [
      "Xác lập và thực hiện lợi ích kinh tế",
      "Chọn màu bao bì sản phẩm",
      "Tổ chức hoạt động văn nghệ",
      "Quyết định khẩu vị của người tiêu dùng",
    ],
    answer: 0,
  },
  {
    tag: "Tình huống",
    question: "Trong tình huống bài, ai bán 1kg cà phê nhân với giá 40.000đ/kg?",
    options: ["Anh Khánh", "Highland Coffee", "Người tiêu dùng", "Nhà rang xay"],
    answer: 0,
  },
  {
    tag: "Tình huống",
    question: "Một ly cà phê ở thành phố được nêu trong tình huống có giá bao nhiêu?",
    options: ["85.000đ/ly", "40.000đ/ly", "185.000đ/ly", "32.000đ/ly"],
    answer: 0,
  },
  {
    tag: "Chuỗi giá trị",
    question: "Thứ tự chuỗi quan hệ lợi ích phù hợp nhất trong tình huống là gì?",
    options: [
      "Nông dân → thương lái → nhà rang xay → chuỗi bán lẻ → người tiêu dùng",
      "Người tiêu dùng → nông dân → nhà nước → thương lái",
      "Nhà rang xay → nông dân → người tiêu dùng → thương lái",
      "Chuỗi bán lẻ → người tiêu dùng → nông dân → thương lái",
    ],
    answer: 0,
  },
  {
    tag: "Chuỗi giá trị",
    question: "Mắt xích nào tạo nguyên liệu ban đầu và chịu nhiều rủi ro thời tiết, sâu bệnh?",
    options: ["Nông dân", "Chuỗi bán lẻ", "Người tiêu dùng", "Bộ phận marketing"],
    answer: 0,
  },
  {
    tag: "Chuỗi giá trị",
    question: "Thương lái trong chuỗi thường tạo giá trị bằng hoạt động nào?",
    options: [
      "Thu gom, phân loại, bảo quản, vận chuyển",
      "Pha chế và bán tại cửa hàng",
      "Thiết kế ly uống mang đi",
      "Quyết định chính sách tín dụng quốc gia",
    ],
    answer: 0,
  },
  {
    tag: "Chuỗi giá trị",
    question: "Nhà rang xay chủ yếu làm tăng giá trị bằng cách nào?",
    options: [
      "Rang, phối trộn, kiểm soát chất lượng và phát triển sản phẩm",
      "Chỉ mua rồi bán ngay không thay đổi gì",
      "Chỉ thu tiền giữ xe",
      "Thay thế vai trò của người tiêu dùng",
    ],
    answer: 0,
  },
  {
    tag: "Doanh thu",
    question: "Vì sao 85.000đ/ly không thể xem toàn bộ là tiền cà phê trả cho nông dân?",
    options: [
      "Vì còn chi phí rang xay, nhân công, mặt bằng, thương hiệu, dịch vụ và lợi nhuận",
      "Vì người tiêu dùng không hề trả tiền",
      "Vì cà phê không cần nguyên liệu",
      "Vì mọi khâu đều nhận bằng nhau tuyệt đối",
    ],
    answer: 0,
  },
  {
    tag: "Mâu thuẫn",
    question: "Quan hệ lợi ích kinh tế vừa thống nhất vừa mâu thuẫn vì lý do nào?",
    options: [
      "Các chủ thể cần nhau nhưng mỗi bên vẫn theo đuổi lợi ích riêng",
      "Các chủ thể không bao giờ liên quan đến nhau",
      "Lợi ích kinh tế chỉ tồn tại trong hộ gia đình",
      "Thị trường luôn chia lợi ích bằng nhau",
    ],
    answer: 0,
  },
  {
    tag: "Mâu thuẫn",
    question: "Trong chuỗi cà phê, biểu hiện rõ của mâu thuẫn lợi ích là gì?",
    options: [
      "Nông dân chịu rủi ro lớn nhưng quyền thương lượng thấp",
      "Người tiêu dùng không được uống cà phê",
      "Doanh nghiệp không cần lợi nhuận",
      "Thương lái không có vai trò nào",
    ],
    answer: 0,
  },
  {
    tag: "Thị trường",
    question: "Trong kinh tế thị trường, lợi ích kinh tế thường được thực hiện thông qua cơ chế nào?",
    options: ["Giá cả, cạnh tranh, cung - cầu", "Bốc thăm ngẫu nhiên", "Mệnh lệnh cá nhân", "Chỉ qua quà tặng"],
    answer: 0,
  },
  {
    tag: "Rủi ro giá",
    question: "Khi giá thế giới giảm, bên nào dễ chịu thiệt hơn nếu phải bán ngay?",
    options: ["Nông dân", "Doanh nghiệp đã có hợp đồng cố định", "Người xem thuyết trình", "Nhà cung cấp slide"],
    answer: 0,
  },
  {
    tag: "Hợp đồng",
    question: "Hợp đồng giá cố định giúp doanh nghiệp trong tình huống như thế nào?",
    options: [
      "Giảm rủi ro khi giá thị trường giảm",
      "Xóa hoàn toàn chi phí sản xuất",
      "Làm người tiêu dùng không phải trả tiền",
      "Làm nông dân tự động có quyền định giá cao nhất",
    ],
    answer: 0,
  },
  {
    tag: "Nhà nước",
    question: "Vì sao chỉ dựa vào nguyên tắc thị trường là chưa đủ để hài hòa lợi ích?",
    options: [
      "Vì thị trường có thể tạo chênh lệch quyền lực, thông tin và khả năng chịu rủi ro",
      "Vì thị trường luôn tự động công bằng tuyệt đối",
      "Vì mọi chủ thể có cùng nguồn lực",
      "Vì giá cả không liên quan đến lợi ích",
    ],
    answer: 0,
  },
  {
    tag: "Nhà nước",
    question: "Công cụ nào của Nhà nước giúp bảo vệ hợp đồng và xử lý tranh chấp?",
    options: ["Pháp luật", "Màu sắc thương hiệu", "Khẩu vị cà phê", "Trang trí cửa hàng"],
    answer: 0,
  },
  {
    tag: "Nhà nước",
    question: "Thông tin công khai về giá và chất lượng giúp giảm vấn đề gì trong chuỗi?",
    options: ["Bất cân xứng thông tin", "Số lượng người uống cà phê", "Mùi thơm của cà phê", "Nhu cầu học tập"],
    answer: 0,
  },
  {
    tag: "Hợp tác xã",
    question: "Hợp tác xã giúp nông dân tăng vị thế thương lượng chủ yếu nhờ điều gì?",
    options: [
      "Gom sản lượng, thống nhất tiêu chuẩn, có kho và ký hợp đồng trực tiếp",
      "Tách từng hộ ra bán riêng lẻ",
      "Bỏ qua chất lượng sản phẩm",
      "Không cần thông tin thị trường",
    ],
    answer: 0,
  },
  {
    tag: "Công bằng",
    question: "Điều khoản nào giúp nông dân bớt thiệt khi giá thị trường giảm sâu?",
    options: ["Giá thu mua tối thiểu", "Cấm ghi chất lượng", "Không có cơ chế tranh chấp", "Không cần truy xuất nguồn gốc"],
    answer: 0,
  },
  {
    tag: "Kết luận",
    question: "Một chuỗi cà phê bền vững cần hướng tới điều gì?",
    options: [
      "Hài hòa lợi ích giữa nông dân, doanh nghiệp và xã hội",
      "Một mắt xích luôn chịu thiệt",
      "Chỉ tối đa hóa lợi ích của bên bán lẻ",
      "Bỏ qua vai trò của người trồng",
    ],
    answer: 0,
  },
];

const clients = new Set();
const players = new Map();
const state = {
  phase: "lobby",
  questionIndex: 0,
  roundAnswers: {},
};

function resolvePath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const filePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^[/\\]/, "");
  return join(publicDir, filePath);
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function publicQuestion() {
  const item = questions[state.questionIndex];
  if (!item) return null;
  const base = {
    index: state.questionIndex,
    total: questions.length,
    tag: item.tag,
    question: item.question,
    options: item.options,
  };
  if (["reveal", "scoreboard", "finished"].includes(state.phase)) base.answer = item.answer;
  return base;
}

function scoreboard() {
  return [...players.values()]
    .sort((a, b) => b.score - a.score || b.correct - a.correct || a.name.localeCompare(b.name))
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

function answersSummary() {
  const counts = [0, 0, 0, 0];
  const byPlayer = [...players.values()].map((player) => {
    const value = state.roundAnswers[player.id];
    if (Number.isInteger(value)) counts[value] += 1;
    return {
      id: player.id,
      name: player.name,
      answer: Number.isInteger(value) ? value : null,
      correct: Number.isInteger(value) ? value === questions[state.questionIndex]?.answer : null,
    };
  });
  return { counts, byPlayer };
}

function snapshot() {
  return {
    phase: state.phase,
    questionIndex: state.questionIndex,
    totalQuestions: questions.length,
    question: publicQuestion(),
    players: [...players.values()],
    scoreboard: scoreboard(),
    answers: answersSummary(),
  };
}

function broadcast() {
  const payload = `data: ${JSON.stringify(snapshot())}\n\n`;
  for (const res of clients) res.write(payload);
}

function resetRoundAnswers() {
  state.roundAnswers = {};
  for (const player of players.values()) {
    player.currentAnswer = null;
  }
}

function requirePlayer(id) {
  return id && players.has(id) ? players.get(id) : null;
}

async function handleApi(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (url.pathname === "/api/events") {
    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    });
    clients.add(res);
    res.write(`data: ${JSON.stringify(snapshot())}\n\n`);
    req.on("close", () => clients.delete(res));
    return true;
  }

  if (url.pathname === "/api/state") {
    sendJson(res, snapshot());
    return true;
  }

  if (req.method !== "POST") return false;

  const body = await readBody(req);

  if (url.pathname === "/api/join") {
    const name = String(body.name || "").trim().slice(0, 30) || `Nhóm ${players.size + 1}`;
    let player = requirePlayer(body.id);
    if (!player) {
      const id = randomUUID();
      player = { id, name, score: 0, coins: 0, combo: 0, correct: 0, currentAnswer: null };
      players.set(id, player);
    } else {
      player.name = name;
    }
    broadcast();
    sendJson(res, { ok: true, player });
    return true;
  }

  if (url.pathname === "/api/answer") {
    const player = requirePlayer(body.id);
    const choice = Number(body.choice);
    if (!player || state.phase !== "question" || !Number.isInteger(choice) || choice < 0 || choice > 3) {
      sendJson(res, { ok: false }, 400);
      return true;
    }
    if (!Number.isInteger(state.roundAnswers[player.id])) {
      state.roundAnswers[player.id] = choice;
      player.currentAnswer = choice;
    }
    broadcast();
    sendJson(res, { ok: true });
    return true;
  }

  if (url.pathname === "/api/start") {
    state.phase = "question";
    state.questionIndex = 0;
    for (const player of players.values()) Object.assign(player, { score: 0, coins: 0, combo: 0, correct: 0 });
    resetRoundAnswers();
    broadcast();
    sendJson(res, { ok: true });
    return true;
  }

  if (url.pathname === "/api/reveal") {
    const answer = questions[state.questionIndex]?.answer;
    for (const player of players.values()) {
      const selected = state.roundAnswers[player.id];
      if (selected === answer) {
        player.combo += 1;
        player.correct += 1;
        const bonus = Math.min(player.combo - 1, 5) * 20;
        player.score += 100 + bonus;
        player.coins += 10 + player.combo * 2;
      } else {
        player.combo = 0;
      }
    }
    state.phase = "reveal";
    broadcast();
    sendJson(res, { ok: true });
    return true;
  }

  if (url.pathname === "/api/scoreboard") {
    state.phase = state.questionIndex >= questions.length - 1 ? "finished" : "scoreboard";
    broadcast();
    sendJson(res, { ok: true });
    return true;
  }

  if (url.pathname === "/api/next") {
    if (state.questionIndex >= questions.length - 1) {
      state.phase = "finished";
    } else {
      state.questionIndex += 1;
      state.phase = "question";
      resetRoundAnswers();
    }
    broadcast();
    sendJson(res, { ok: true });
    return true;
  }

  if (url.pathname === "/api/reset") {
    state.phase = "lobby";
    state.questionIndex = 0;
    players.clear();
    resetRoundAnswers();
    broadcast();
    sendJson(res, { ok: true });
    return true;
  }

  return false;
}

createServer(async (req, res) => {
  if (req.url?.startsWith("/api/") && (await handleApi(req, res))) return;

  try {
    const file = resolvePath(req.url || "/");
    const data = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream",
      "cache-control": extname(file) === ".html" ? "public, max-age=60" : "public, max-age=31536000, immutable",
    });
    res.end(data);
  } catch {
    const data = await readFile(join(publicDir, "index.html"));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(data);
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Coffee presentation running on port ${port}`);
});
