const progressBar = document.querySelector("#progressBar");
const sceneLinks = [...document.querySelectorAll("[data-nav]")];
const scenes = [...document.querySelectorAll(".scene")];
const revealEls = [...document.querySelectorAll(".reveal")];
const topbar = document.querySelector("#topbar");
const topbarToggle = document.querySelector("#topbarToggle");
const storyGate = document.querySelector("#storyGate");
const startGame = document.querySelector("#startGame");
const gameHudScene = document.querySelector("#hudScene");
const khanhChat = document.querySelector("#khanhChat");
const chatToggle = document.querySelector("#chatToggle");
const chatPanel = document.querySelector("#chatPanel");
const chatScene = document.querySelector("#chatScene");
const chatMessage = document.querySelector("#chatMessage");
let currentScene = "1";

const sceneConcepts = {
  "1": {
    term: "Lợi ích kinh tế",
    text: "Giáo trình 5.3.1 xem lợi ích kinh tế là lợi ích vật chất mà các chủ thể thu được trong hoạt động kinh tế. Đây là động lực khiến Anh Khánh, thương lái, doanh nghiệp và người tiêu dùng đều hành động."
  },
  "2": {
    term: "Lợi ích gắn với điều kiện sản xuất",
    text: "Mức thỏa mãn lợi ích phụ thuộc vào số lượng, chất lượng hàng hóa và trình độ sản xuất. Vì vậy, một năm lao động và chi phí của Anh Khánh là nền để hiểu giá 40.000đ/kg."
  },
  "3": {
    term: "Quan hệ lợi ích kinh tế",
    text: "Quan hệ lợi ích kinh tế là các tương tác giữa người với người, tổ chức với tổ chức trong xác lập và thực hiện lợi ích. Chuỗi cà phê chính là mạng quan hệ lợi ích giữa nhiều chủ thể."
  },
  "4": {
    term: "Thực hiện lợi ích theo nguyên tắc thị trường",
    text: "Trong kinh tế thị trường, giá cả, cạnh tranh, cung - cầu là cơ chế quan trọng để các chủ thể thực hiện lợi ích. Thanh phân rã cho thấy giá bán lẻ không tự động phản ánh phần của người trồng."
  },
  "5": {
    term: "Thống nhất và mâu thuẫn lợi ích",
    text: "Các lợi ích vừa thống nhất vì chủ thể này có thể là điều kiện cho chủ thể khác, vừa mâu thuẫn khi mỗi bên theo đuổi lợi ích riêng. Cán cân mô phỏng độ lệch quyền mặc cả trong quan hệ đó."
  },
  "6": {
    term: "Nhân tố tác động: hội nhập và thị trường",
    text: "Giáo trình nhấn mạnh hội nhập và biến động thị trường có thể làm lợi ích thay đổi mạnh. Cú sốc giá cho thấy bên có ít công cụ phòng ngừa thường chịu rủi ro nhiều hơn."
  },
  "7": {
    term: "Hài hòa lợi ích kinh tế",
    text: "Hài hòa lợi ích là hạn chế mặt mâu thuẫn, tránh va chạm/xung đột và khuyến khích mặt thống nhất. Nhà nước dùng pháp luật, chính sách, hành chính, thông tin để điều tiết quan hệ này."
  },
  "8": {
    term: "Vai trò Nhà nước",
    text: "Mục 5.3.2 nêu các vai trò: bảo vệ lợi ích hợp pháp, tạo môi trường thuận lợi, điều hòa cá nhân - doanh nghiệp - xã hội, kiểm soát tiêu cực và giải quyết mâu thuẫn."
  },
  "9": {
    term: "Lợi ích nhóm tích cực",
    text: "Giáo trình thừa nhận các cá nhân/tổ chức có thể liên kết thành nhóm lợi ích nếu phù hợp lợi ích quốc gia và không gây hại lợi ích khác. Hợp tác xã là cách liên kết tích cực của nông dân."
  },
  "10": {
    term: "Chính sách và tổ chức xã hội",
    text: "Ngoài nguyên tắc thị trường, giáo trình nhấn mạnh cần chính sách Nhà nước và vai trò tổ chức xã hội để khắc phục hạn chế thị trường. Hợp đồng công bằng biến nguyên tắc ấy thành điều khoản."
  },
  "11": {
    term: "Lợi ích cá nhân - doanh nghiệp - xã hội",
    text: "Lợi ích cá nhân chính đáng cần được tôn trọng, nhưng phải đặt trong liên hệ với lợi ích doanh nghiệp và xã hội. Chuỗi bền vững là khi ba nhóm lợi ích này cùng được thực hiện hợp lý."
  }
};

const gameGuide = {
  "1": {
    name: "Cảnh 1 · Mở đầu",
    scene: "Bạn là Anh Khánh. Cảnh này đặt vấn đề: vì sao 1kg cà phê nhân 40.000đ lại liên quan đến một ly cà phê 85.000đ ở thành phố.",
    action: "Bấm nút theo dõi hạt cà phê hoặc cuộn xuống Cảnh 2 để bắt đầu hành trình.",
    talk: "Mở bài nên nói: tôi không chỉ bán cà phê, tôi đang bước vào một chuỗi lợi ích có nhiều chủ thể."
  },
  "2": {
    name: "Cảnh 2 · Một năm lao động",
    scene: "Bạn kéo qua 12 tháng để thấy chi phí và công sức được bỏ ra trước khi có giá bán 40.000đ/kg.",
    action: "Kéo thanh tháng, bấm các giai đoạn và thử nút gặp rủi ro để cây đổi trạng thái.",
    talk: "Nhấn mạnh rằng giá bán xuất hiện cuối vụ, còn chi phí và rủi ro đã tích lũy từ đầu năm."
  },
  "3": {
    name: "Cảnh 3 · Chuỗi giá trị",
    scene: "Bạn đi qua các mắt xích từ nông dân, thương lái, rang xay, bán lẻ đến người tiêu dùng.",
    action: "Bấm từng mắt xích hoặc bật các nút chi phí để thấy gánh nặng tăng khi tự ôm thêm khâu.",
    talk: "Nói rằng giá trị được tạo thêm ở nhiều khâu, nhưng quyền quyết định giá không chia đều."
  },
  "4": {
    name: "Cảnh 4 · 85.000đ chia thế nào",
    scene: "Bạn mô phỏng một ly cà phê bán lẻ và xem phần nguyên liệu của người trồng chỉ chiếm tỷ lệ rất nhỏ.",
    action: "Kéo giá một ly và gram cà phê mỗi ly, sau đó chỉ vào tỷ lệ nông dân nhận trên giá ly.",
    talk: "Đây là cảnh gây chú ý nhất: 85.000đ không phải toàn bộ là tiền cà phê, và phần nguyên liệu chỉ khoảng 1% trong mô phỏng."
  },
  "5": {
    name: "Cảnh 5 · Mâu thuẫn lợi ích",
    scene: "Bạn điều chỉnh quyền mặc cả để thấy cán cân lợi ích nghiêng về bên có vốn, công nghệ, thông tin và thương hiệu.",
    action: "Kéo thanh quyền mặc cả của nông dân và quan sát cán cân đổi độ nghiêng.",
    talk: "Nói rằng mâu thuẫn không nằm ở chuyện doanh nghiệp có lợi nhuận, mà ở khả năng bên mạnh đẩy rủi ro sang bên yếu."
  },
  "6": {
    name: "Cảnh 6 · Cú sốc giá",
    scene: "Bạn gặp tình huống giá thế giới giảm: người bán ngay chịu rủi ro nhiều hơn bên có hợp đồng cố định.",
    action: "Bấm mô phỏng cú sốc giá -30% để so sánh phản ứng của nông dân và doanh nghiệp.",
    talk: "Liên hệ với đề: khi giá giảm, Anh Khánh lỗ nhưng doanh nghiệp có hợp đồng vẫn giữ được lợi thế."
  },
  "7": {
    name: "Cảnh 7 · Vai trò Nhà nước",
    scene: "Bạn xem các công cụ Nhà nước có thể làm quan hệ lợi ích bớt lệch như thế nào.",
    action: "Bấm từng công cụ: pháp luật, chính sách kinh tế, hành chính, thông tin, hòa giải.",
    talk: "Nói rằng thị trường cần luật chơi minh bạch để các lợi ích thống nhất và mâu thuẫn được xử lý."
  },
  "8": {
    name: "Cảnh 8 · Bốn vai trò",
    scene: "Bạn mở bốn vai trò của Nhà nước: bảo vệ, điều hòa, kiểm soát tiêu cực và giải quyết mâu thuẫn.",
    action: "Click từng thẻ để lật sang ví dụ thực tế rồi click lại để quay về.",
    talk: "Dùng cảnh này như phần nối với lý thuyết giáo trình: Nhà nước không thay thị trường, mà tạo điều kiện để thị trường công bằng hơn."
  },
  "9": {
    name: "Cảnh 9 · Hợp tác xã",
    scene: "Bạn thử tăng số hộ tham gia để thấy sức thương lượng tăng khi nông dân liên kết lại.",
    action: "Kéo số hộ từ thấp lên cao và đọc phần giá bán giả định tăng thêm.",
    talk: "Kết luận nhỏ: một hộ riêng lẻ yếu, nhưng 1.000 hộ có sản lượng và tiếng nói để đàm phán."
  },
  "10": {
    name: "Cảnh 10 · Hợp đồng công bằng",
    scene: "Bạn xây hợp đồng bằng cách chọn điều khoản bảo vệ người trồng cà phê.",
    action: "Tick hoặc bỏ tick từng điều khoản để xem thu nhập ước tính thay đổi.",
    talk: "Nói rằng công bằng không chỉ là thiện chí, mà phải được viết thành điều khoản cụ thể."
  },
  "11": {
    name: "Cảnh 11 · Kết luận",
    scene: "Bạn khép lại hành trình của Anh Khánh và nhìn lại ba lợi ích: nông dân, doanh nghiệp, xã hội.",
    action: "Tick đủ 3 cam kết để hiện phản hồi cuối và dùng nó làm câu chốt.",
    talk: "Câu chốt: đằng sau vị đắng của cà phê không nên là vị đắng của người trồng."
  }
};

function updateGameContext(scene = currentScene) {
  currentScene = scene;
  const guide = gameGuide[scene] || gameGuide["1"];
  if (gameHudScene) gameHudScene.textContent = guide.name;
  if (chatScene) chatScene.textContent = `Bạn đang ở ${guide.name}`;
}

function setChatOpen(open) {
  if (!khanhChat || !chatToggle) return;
  khanhChat.classList.toggle("is-open", open);
  chatToggle.setAttribute("aria-expanded", String(open));
}

function answerGuide(kind) {
  if (!chatMessage) return;
  const guide = gameGuide[currentScene] || gameGuide["1"];
  const concept = sceneConcepts[currentScene] || sceneConcepts["1"];
  const answers = {
    rules: "Luật chơi: bạn là Anh Khánh. Đi qua từng cảnh, kéo thanh, bấm thẻ, thử mô phỏng và dùng kết quả để giải thích quan hệ lợi ích kinh tế trong chuỗi cà phê.",
    scene: guide.scene,
    concept: `Khái niệm giáo trình: ${concept.term}. ${concept.text}`,
    talk: guide.talk,
    action: guide.action,
  };
  chatMessage.textContent = answers[kind] || guide.scene;
}

if (storyGate) document.body.classList.add("game-locked");
startGame?.addEventListener("click", () => {
  document.body.classList.add("game-started");
  document.body.classList.remove("game-locked");
  window.setTimeout(() => {
    storyGate?.setAttribute("hidden", "");
  }, 460);
  setChatOpen(false);
  updateGameContext("1");
  document.querySelector("#scene-1")?.scrollIntoView({ behavior: "smooth" });
});

chatToggle?.addEventListener("click", () => setChatOpen(!khanhChat?.classList.contains("is-open")));
document.querySelectorAll("[data-chat-choice]").forEach((button) => {
  button.addEventListener("click", () => answerGuide(button.dataset.chatChoice));
});

function setTopbar(open) {
  if (!topbar || !topbarToggle) return;
  topbar.classList.toggle("is-open", open);
  topbarToggle.classList.toggle("is-open", open);
  topbarToggle.setAttribute("aria-expanded", String(open));
  topbarToggle.setAttribute("aria-label", open ? "Ẩn thanh điều hướng" : "Mở thanh điều hướng");
}

topbarToggle?.addEventListener("click", () => setTopbar(!topbar?.classList.contains("is-open")));
topbar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setTopbar(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setTopbar(false);
});
setTopbar(false);

sceneLinks.forEach((link) => {
  link.title = link.dataset.label || `Cảnh ${link.dataset.nav}`;
});

document.querySelectorAll(".scene h2").forEach((heading) => {
  const text = heading.textContent.trim();
  if (!text || heading.querySelector(".kinetic-word")) return;
  heading.innerHTML = text
    .split(/\s+/)
    .map((word, index) => `<span class="kinetic-word" style="transition-delay:${index * 42}ms">${word}</span>`)
    .join(" ");
});

scenes.forEach((scene) => {
  [...scene.querySelectorAll(".reveal")].forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 90, 270)}ms`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const sceneObserver = new IntersectionObserver(
  (entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    const scene = active.target.dataset.scene;
    document.body.dataset.scene = scene;
    updateGameContext(scene);
    scenes.forEach((item) => item.classList.toggle("active-scene", item === active.target));
    sceneLinks.forEach((link) => link.classList.toggle("active", link.dataset.nav === scene));
  },
  { threshold: [0.36, 0.52, 0.68] }
);

scenes.forEach((scene) => sceneObserver.observe(scene));
if (scenes[0]) scenes[0].classList.add("active-scene");

function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const amount = total <= 0 ? 0 : window.scrollY / total;
  progressBar.style.width = `${Math.min(100, Math.max(0, amount * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const coffeePlant = document.querySelector("#coffeePlant");
const plantStages = [...document.querySelectorAll("[data-plant-stage]")];
const monthSlider = document.querySelector("#monthSlider");
const monthValue = document.querySelector("#monthValue");
const sunkCostOut = document.querySelector("#sunkCostOut");
const sunkCostFill = document.querySelector("#sunkCostFill");
const riskButton = document.querySelector("#riskButton");
const timelineBox = document.querySelector(".timeline");
const farmerMood = document.querySelector("#farmerMood");
let riskActive = false;

function setPlantStage(stage) {
  if (!coffeePlant) return;
  coffeePlant.className = `plant stage-${stage}`;
  if (riskActive) coffeePlant.classList.add("risk-hit");
  plantStages.forEach((item) => {
    const isActive = item.dataset.plantStage === String(stage);
    item.classList.toggle("active-stage", isActive);
    item.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function stageFromMonth(month) {
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 10) return 3;
  return 4;
}

function formatVndShort(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function updateTimeline() {
  if (!monthSlider) return;
  const month = Number(monthSlider.value);
  const stage = stageFromMonth(month);
  const baseCost = (38_000_000 * month) / 12;
  const riskCost = riskActive ? 4_500_000 : 0;
  const cost = Math.min(45_000_000, baseCost + riskCost);
  monthValue.textContent = `Tháng ${month}`;
  sunkCostOut.textContent = formatVndShort(cost);
  sunkCostFill.style.width = `${Math.min(100, (cost / 45_000_000) * 100)}%`;
  if (farmerMood) farmerMood.textContent = riskActive ? "😟" : month >= 11 ? "😐" : "🙂";
  timelineBox.classList.toggle("risk-active", riskActive);
  setPlantStage(stage);
}

plantStages.forEach((item) => {
  item.setAttribute("role", "button");
  item.setAttribute("aria-pressed", item.classList.contains("active-stage") ? "true" : "false");
  item.addEventListener("click", () => {
    const stage = Number(item.dataset.plantStage);
    const monthByStage = { 1: 1, 2: 4, 3: 8, 4: 12 };
    if (monthSlider) monthSlider.value = monthByStage[stage];
    updateTimeline();
  });
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      item.click();
    }
  });
});

if (monthSlider) {
  monthSlider.addEventListener("input", updateTimeline);
  riskButton.addEventListener("click", () => {
    riskActive = !riskActive;
    riskButton.textContent = riskActive ? "Rủi ro đã xảy ra" : "Gặp rủi ro";
    updateTimeline();
  });
  updateTimeline();
}

const cupPrice = document.querySelector("#cupPrice");
const grams = document.querySelector("#grams");
const cupsOut = document.querySelector("#cupsOut");
const revenueOut = document.querySelector("#revenueOut");
const cupPriceValue = document.querySelector("#cupPriceValue");
const gramsValue = document.querySelector("#gramsValue");
const calcNarrative = document.querySelector("#calcNarrative");
const farmerShareOut = document.querySelector("#farmerShareOut");
const revenueBar = document.querySelector("#revenueBar");
const cupLayers = {
  profit: document.querySelector("#layerProfit"),
  brand: document.querySelector("#layerBrand"),
  labor: document.querySelector("#layerLabor"),
  place: document.querySelector("#layerPlace"),
  roast: document.querySelector("#layerRoast"),
  bean: document.querySelector("#layerBean"),
};

function formatCurrency(value) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function formatMillion(value) {
  const million = value / 1_000_000;
  return `${million.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
}

function updateCalculator() {
  const price = Number(cupPrice.value);
  const gramValue = Number(grams.value);
  const roastedGrams = 1000 * 0.82;
  const cups = Math.floor(roastedGrams / gramValue);
  const revenue = cups * price;
  const priceScale = (price - Number(cupPrice.min)) / (Number(cupPrice.max) - Number(cupPrice.min));
  const gramScale = (gramValue - Number(grams.min)) / (Number(grams.max) - Number(grams.min));
  const farmerAmount = (gramValue / 0.82 / 1000) * 40000;
  const remaining = Math.max(0, price - farmerAmount);
  const weights = {
    roast: 14 + gramScale * 5,
    place: 22 - priceScale * 2,
    labor: 18 + priceScale * 2,
    brand: 15 + priceScale * 6,
    profit: 14 + priceScale * 8,
  };
  const weightTotal = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const amounts = {
    farmer: farmerAmount,
    roast: (remaining * weights.roast) / weightTotal,
    place: (remaining * weights.place) / weightTotal,
    labor: (remaining * weights.labor) / weightTotal,
    brand: (remaining * weights.brand) / weightTotal,
    profit: (remaining * weights.profit) / weightTotal,
  };
  const segments = [
    { label: "Nguyên liệu", key: "farmer", layer: "bean", amount: amounts.farmer, color: "#3b1a11" },
    { label: "Rang xay", key: "roast", layer: "roast", amount: amounts.roast, color: "#6a341f" },
    { label: "Mặt bằng", key: "place", layer: "place", amount: amounts.place, color: "#a46a3f" },
    { label: "Nhân công", key: "labor", layer: "labor", amount: amounts.labor, color: "#c98745" },
    { label: "Thương hiệu", key: "brand", layer: "brand", amount: amounts.brand, color: "#d6a256" },
    { label: "Lợi nhuận", key: "profit", layer: "profit", amount: amounts.profit, color: "#f3dca1" },
  ].map((segment) => ({
    ...segment,
    percent: (segment.amount / price) * 100,
    displayPercent: (segment.amount / price) * 100,
  }));

  cupPriceValue.textContent = formatCurrency(price);
  gramsValue.textContent = `${gramValue}g`;
  cupsOut.textContent = `${cups} ly`;
  revenueOut.textContent = formatMillion(revenue);
  const farmerPercent = (farmerAmount / price) * 100;
  farmerShareOut.textContent = `${farmerPercent.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
  calcNarrative.textContent = `Với ${formatCurrency(price)}/ly và ${gramValue}g/ly, phần nguyên liệu cà phê trong một ly chỉ khoảng ${formatCurrency(Math.round(farmerAmount))}, tương đương ${farmerPercent.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}% giá bán.`;

  revenueBar.innerHTML = segments
    .map((segment) => {
      const visualPercent = Math.max(1.2, segment.percent);
      const percentText = segment.displayPercent.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
      const amountText = formatCurrency(Math.round(segment.amount));
      return `<div class="revenue-segment segment-${segment.key}" style="width:${visualPercent}%;background:${segment.color}" title="${segment.label}: ${amountText} (${percentText}%)"><span>${segment.label}<small>${percentText}%</small></span></div>`;
    })
    .join("");

  segments.forEach((segment) => {
    const layer = cupLayers[segment.layer];
    if (!layer) return;
    const percentText = segment.displayPercent.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
    layer.style.setProperty("--layer-height", `${Math.max(48, segment.percent * 4.7)}px`);
    const output = layer.querySelector("strong");
    if (output) output.textContent = `${percentText}%`;
  });
}

[cupPrice, grams].forEach((input) => input.addEventListener("input", updateCalculator));
updateCalculator();

const costButtons = [...document.querySelectorAll("[data-cost]")];
const costFill = document.querySelector("#costFill");
const costTotal = document.querySelector("#costTotal");
const costMap = { roast: 18000, place: 26000, brand: 22000 };

function updateCostGame() {
  if (!costFill || !costTotal) return;
  const total = 40000 + costButtons.reduce((sum, button) => sum + (button.classList.contains("active") ? costMap[button.dataset.cost] : 0), 0);
  costFill.style.width = `${Math.min(100, (total / 106000) * 100)}%`;
  costTotal.textContent = formatCurrency(total);
  costTotal.classList.remove("pulse-value");
  requestAnimationFrame(() => costTotal.classList.add("pulse-value"));
}

costButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    updateCostGame();
  });
});

updateCostGame();

const shockButton = document.querySelector("#shockButton");
const shockSim = document.querySelector(".shock-sim");
const farmerShock = document.querySelector("#farmerShock");
const firmShock = document.querySelector("#firmShock");

if (shockButton) {
  shockButton.addEventListener("click", () => {
    const shocked = !shockSim.classList.contains("shocked");
    shockSim.classList.toggle("shocked", shocked);
    farmerShock.textContent = shocked ? "28.000đ/kg" : "32.000đ/kg";
    firmShock.textContent = shocked ? "45.000đ/kg" : "45.000đ/kg";
    shockButton.textContent = shocked ? "Khôi phục mô phỏng" : "Kích hoạt cú sốc giá -30%";
  });
}

const coopSlider = document.querySelector("#coopSlider");
const coopHouseholds = document.querySelector("#coopHouseholds");
const bargainFill = document.querySelector("#bargainFill");
const coopResult = document.querySelector("#coopResult");

function updateCoop() {
  if (!coopSlider) return;
  const households = Number(coopSlider.value);
  const power = Math.round((Math.log10(households) / 3) * 100);
  const bonus =
    households <= 100
      ? Math.round((households / 100) * 3000)
      : households <= 500
        ? Math.round(3000 + ((households - 100) / 400) * 5000)
        : Math.round(8000 + ((households - 500) / 500) * 4000);
  coopHouseholds.textContent = `${households.toLocaleString("vi-VN")} hộ`;
  bargainFill.style.width = `${power}%`;
  coopResult.textContent = `Quyền thương lượng đạt khoảng ${power}%, giá bán giả định có thể tăng thêm khoảng ${bonus.toLocaleString("vi-VN")}đ/kg nhờ gom sản lượng và ký hợp đồng trực tiếp.`;
}

if (coopSlider) {
  coopSlider.addEventListener("input", updateCoop);
  updateCoop();
}

const contractChecks = [...document.querySelectorAll("[data-contract]")];
const contractIncome = document.querySelector("#contractIncome");
const contractBonus = { floor: 1800, formula: 1400, quality: 2200, share: 1800, support: 1200, dispute: 800 };

function updateContractBuilder() {
  if (!contractIncome) return;
  const income = contractChecks.reduce((sum, input) => sum + (input.checked ? contractBonus[input.dataset.contract] : 0), 40000);
  contractIncome.textContent = `${income.toLocaleString("vi-VN")}đ/kg`;
}

contractChecks.forEach((input) => input.addEventListener("change", updateContractBuilder));
updateContractBuilder();

const scale = document.querySelector(".scale");
const bargainSlider = document.querySelector("#bargainSlider");
const bargainPowerOut = document.querySelector("#bargainPowerOut");
const balanceResult = document.querySelector("#balanceResult");

function updateBalance() {
  if (!bargainSlider || !scale) return;
  const power = Number(bargainSlider.value);
  const farmerReceive = Math.round(8 + power * 0.42);
  const angle = 12 - power * 0.24;
  scale.style.setProperty("--balance-angle", `${angle}deg`);
  bargainPowerOut.textContent = `${power}%`;
  balanceResult.textContent = `Khi quyền mặc cả đạt ${power}%, phần hưởng lợi mô phỏng của nông dân tăng lên khoảng ${farmerReceive}%.`;
}

if (bargainSlider) {
  bargainSlider.addEventListener("input", updateBalance);
  updateBalance();
}

const policyButtons = [...document.querySelectorAll("[data-policy]")];
const policyTitle = document.querySelector("#policyTitle");
const policyText = document.querySelector("#policyText");
const policyBefore = document.querySelector("#policyBefore");
const policyAfter = document.querySelector("#policyAfter");
const policyBeforeValue = document.querySelector("#policyBeforeValue");
const policyAfterValue = document.querySelector("#policyAfterValue");
const policyEffect = document.querySelector(".policy-effect");
const stateHand = document.querySelector("#stateHand");
const policyData = {
  law: ["Pháp luật", "Bảo vệ hợp đồng, cân đo và chỉ dẫn nguồn gốc làm giảm rủi ro bị ép điều kiện giao dịch.", 34, 54],
  economic: ["Chính sách kinh tế", "Giá sàn, tín dụng và hỗ trợ liên kết giúp nông dân có thêm thời gian và vị thế khi bán.", 32, 58],
  admin: ["Công cụ hành chính", "Kiểm tra gian lận, xử phạt phá hợp đồng và quản lý chất lượng giúp thị trường bớt méo mó.", 30, 48],
  info: ["Thông tin", "Công khai giá và tiêu chuẩn chất lượng làm giảm bất cân xứng thông tin giữa hộ nhỏ và bên mua.", 28, 52],
  mediate: ["Hòa giải tranh chấp", "Cơ chế hòa giải/trọng tài làm chi phí tranh chấp thấp hơn và trách nhiệm rõ hơn.", 31, 50],
};

function setPolicy(key) {
  const item = policyData[key];
  if (!item || !policyTitle) return;
  policyButtons.forEach((button) => button.classList.toggle("active", button.dataset.policy === key));
  policyTitle.textContent = item[0];
  policyText.textContent = item[1];
  policyBefore.style.width = `${item[2]}%`;
  policyAfter.style.width = `${item[3]}%`;
  if (policyBeforeValue) policyBeforeValue.textContent = `${item[2]}%`;
  if (policyAfterValue) policyAfterValue.textContent = `${item[3]}%`;
  stateHand?.setAttribute("data-policy", key);
  policyEffect?.classList.remove("is-changing");
  stateHand?.classList.remove("is-changing");
  requestAnimationFrame(() => {
    policyEffect?.classList.add("is-changing");
    stateHand?.classList.add("is-changing");
  });
}

policyButtons.forEach((button) => button.addEventListener("click", () => setPolicy(button.dataset.policy)));
if (policyButtons[0]) setPolicy(policyButtons[0].dataset.policy);

document.querySelectorAll(".doors article[data-flip-example]").forEach((card) => {
  const original = card.querySelector("p").textContent;
  const example = card.dataset.flipExample;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.addEventListener("click", () => {
    const flipped = !card.classList.contains("flipped");
    card.classList.toggle("flipped", flipped);
    card.querySelector("p").textContent = flipped ? example : original;
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });
});

const commitmentChecks = [...document.querySelectorAll("[data-commit]")];
const commitmentResult = document.querySelector("#commitmentResult");

function updateCommitment() {
  if (!commitmentResult) return;
  const count = commitmentChecks.filter((input) => input.checked).length;
  document.querySelector(".commitment-box")?.classList.toggle("complete", count === commitmentChecks.length);
  commitmentResult.textContent =
    count === commitmentChecks.length
      ? "Bạn đã khép vòng lợi ích: tiêu dùng có trách nhiệm cũng là một phần của chuỗi công bằng. Sao chép liên kết chia sẻ"
      : `Đã chọn ${count}/3 cam kết.`;
}

commitmentChecks.forEach((input) => input.addEventListener("change", updateCommitment));
commitmentResult?.addEventListener("click", async () => {
  if (!document.querySelector(".commitment-box")?.classList.contains("complete")) return;
  try {
    await navigator.clipboard.writeText(window.location.href.split("#")[0]);
    commitmentResult.textContent = "Đã sao chép liên kết chia sẻ.";
  } catch {
    commitmentResult.textContent = "Bạn đã hoàn tất cam kết. Có thể copy link trên thanh địa chỉ để chia sẻ.";
  }
});
updateCommitment();

const chainItems = [...document.querySelectorAll(".chain > article")];
const chainRoute = document.querySelector(".chain-lab");
const routeDots = [...document.querySelectorAll(".route-dot")];
const chainActorTitle = document.querySelector("#chainActorTitle");
const chainActorSummary = document.querySelector("#chainActorSummary");
const chainContribution = document.querySelector("#chainContribution");
const chainRisk = document.querySelector("#chainRisk");
const chainBenefit = document.querySelector("#chainBenefit");
const chainAuto = document.querySelector("#chainAuto");
let chainAutoTimer = 0;

const chainProfiles = [
  {
    title: "Nông dân",
    summary: "Tạo ra nguyên liệu ban đầu và chịu nhiều rủi ro sản xuất nhất.",
    contribution: "Lao động, đất đai, chăm sóc cây trồng.",
    risk: "Thời tiết, sâu bệnh, giá giảm lúc thu hoạch.",
    benefit: "Thường nhận phần nhỏ vì thiếu kho, vốn và thông tin giá.",
  },
  {
    title: "Thương lái",
    summary: "Nối nhiều hộ sản xuất nhỏ với nhà rang xay và thị trường lớn hơn.",
    contribution: "Thu gom, phân loại, vận chuyển, ứng vốn.",
    risk: "Biến động giá ngắn hạn, tồn kho, hao hụt chất lượng.",
    benefit: "Có lợi thế thông tin và khả năng gom sản lượng.",
  },
  {
    title: "Rang xay",
    summary: "Biến nguyên liệu thô thành sản phẩm có tiêu chuẩn và hương vị ổn định.",
    contribution: "Công nghệ, kiểm soát chất lượng, phối trộn, bao bì.",
    risk: "Chi phí máy móc, tiêu chuẩn đầu ra, cạnh tranh thương hiệu.",
    benefit: "Giữ thêm giá trị nhờ chế biến sâu và thương hiệu sản phẩm.",
  },
  {
    title: "Bán lẻ",
    summary: "Bán trải nghiệm cuối cùng, nơi giá trị thương hiệu được nhìn thấy rõ nhất.",
    contribution: "Mặt bằng, nhân sự, pha chế, dịch vụ, marketing.",
    risk: "Tiền thuê, vận hành, thị hiếu khách hàng, cạnh tranh cửa hàng.",
    benefit: "Có thể thu giá cao nhờ không gian, tiện ích và trải nghiệm.",
  },
  {
    title: "Người tiêu dùng",
    summary: "Chi trả cho sản phẩm cuối cùng và gián tiếp định hình hướng sản xuất.",
    contribution: "Nhu cầu thị trường, phản hồi chất lượng, lựa chọn tiêu dùng.",
    risk: "Trả giá cao nhưng khó biết phần nào quay về người trồng.",
    benefit: "Nhận chất lượng, dịch vụ, câu chuyện và sự tiện lợi.",
  },
];

function setChainStep(index) {
  if (!chainItems.length || !chainRoute) return;
  const safeIndex = Math.max(0, Math.min(chainProfiles.length - 1, index));
  const profile = chainProfiles[safeIndex];
  const progress = safeIndex * 25;
  const left = 8 + safeIndex * 21;

  chainRoute.style.setProperty("--chain-progress", `${progress}%`);
  chainRoute.style.setProperty("--chain-left", `${left}%`);
  chainItems.forEach((item, itemIndex) => {
    item.classList.toggle("active-chain", itemIndex === safeIndex);
    item.setAttribute("aria-pressed", itemIndex === safeIndex ? "true" : "false");
  });
  routeDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex <= safeIndex));

  chainActorTitle.textContent = profile.title;
  chainActorSummary.textContent = profile.summary;
  chainContribution.textContent = profile.contribution;
  chainRisk.textContent = profile.risk;
  chainBenefit.textContent = profile.benefit;
}

chainItems.forEach((item, index) => {
  item.tabIndex = 0;
  item.setAttribute("role", "button");
  item.setAttribute("aria-pressed", "false");
  item.addEventListener("click", () => setChainStep(index));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setChainStep(index);
    }
  });
});

if (chainAuto) {
  chainAuto.addEventListener("click", () => {
    window.clearInterval(chainAutoTimer);
    let index = 0;
    setChainStep(index);
    chainAutoTimer = window.setInterval(() => {
      index += 1;
      if (index >= chainProfiles.length) {
        window.clearInterval(chainAutoTimer);
        return;
      }
      setChainStep(index);
    }, 1150);
  });
}

setChainStep(0);

const beanCanvas = document.querySelector("#beanCanvas");
const beanCtx = beanCanvas.getContext("2d");
const stormCanvas = document.querySelector("#stormCanvas");
const stormCtx = stormCanvas.getContext("2d");
let width = 0;
let height = 0;
let stormWidth = 0;
let stormHeight = 0;
let particles = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  beanCanvas.width = width * dpr;
  beanCanvas.height = height * dpr;
  beanCanvas.style.width = `${width}px`;
  beanCanvas.style.height = `${height}px`;
  beanCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const stormRect = stormCanvas.getBoundingClientRect();
  stormWidth = Math.max(1, stormRect.width);
  stormHeight = Math.max(1, stormRect.height);
  stormCanvas.width = stormWidth * dpr;
  stormCanvas.height = stormHeight * dpr;
  stormCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from({ length: width < 760 ? 44 : 86 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1 + Math.random() * 2.6,
    speed: 0.2 + Math.random() * 0.55,
    phase: i * 0.37,
  }));
}

window.addEventListener("resize", resize);
resize();

function currentScrollRatio() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  return total <= 0 ? 0 : window.scrollY / total;
}

function drawBean(ctx, x, y, size, angle, colorA, colorB, crease = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.24, 2, 0, 0, size);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.74, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
  ctx.shadowBlur = 20;
  if (crease) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 242, 214, 0.42)";
    ctx.lineWidth = Math.max(2, size * 0.05);
    ctx.beginPath();
    ctx.moveTo(-size * 0.12, -size * 0.8);
    ctx.bezierCurveTo(size * 0.24, -size * 0.34, -size * 0.26, size * 0.22, size * 0.12, size * 0.78);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(time) {
  beanCtx.clearRect(0, 0, width, height);
  const scroll = currentScrollRatio();

  particles.forEach((p) => {
    p.y += p.speed;
    if (p.y > height + 8) p.y = -8;
    const shimmer = 0.3 + Math.sin(time * 0.001 + p.phase) * 0.18;
    beanCtx.fillStyle = `rgba(244, 203, 115, ${shimmer})`;
    beanCtx.beginPath();
    beanCtx.arc(p.x + Math.sin(time * 0.0007 + p.phase) * 16, p.y, p.r, 0, Math.PI * 2);
    beanCtx.fill();
  });

  const pathX = width * (0.18 + 0.64 * Math.sin(scroll * Math.PI * 1.15) ** 2);
  const pathY = height * (0.18 + 0.66 * ((scroll * 11) % 1));
  const phase = Math.floor(scroll * 11);
  const colors = [
    ["#efb95e", "#7e2b20"],
    ["#d84b42", "#6e201b"],
    ["#d59b43", "#3b1a11"],
    ["#8f5a32", "#24150f"],
    ["#63b36f", "#1f4c35"],
  ][phase % 5];

  beanCtx.globalAlpha = 0.94;
  drawBean(beanCtx, pathX, pathY, 36 + Math.sin(time * 0.002) * 4, scroll * Math.PI * 8, colors[0], colors[1]);
  beanCtx.globalAlpha = 1;

  beanCtx.strokeStyle = "rgba(255, 242, 214, 0.12)";
  beanCtx.lineWidth = 1.2;
  beanCtx.beginPath();
  for (let i = 0; i <= 140; i += 1) {
    const t = i / 140;
    const x = width * (0.15 + 0.7 * Math.sin(t * Math.PI * 1.15) ** 2);
    const y = height * (0.12 + 0.76 * t);
    if (i === 0) beanCtx.moveTo(x, y);
    else beanCtx.lineTo(x, y);
  }
  beanCtx.stroke();
}

function drawStorm(time) {
  if (!stormWidth || !stormHeight) return;
  stormCtx.clearRect(0, 0, stormWidth, stormHeight);
  const gradient = stormCtx.createLinearGradient(0, 0, stormWidth, stormHeight);
  gradient.addColorStop(0, "rgba(216, 75, 66, 0.16)");
  gradient.addColorStop(1, "rgba(99, 179, 111, 0.08)");
  stormCtx.fillStyle = gradient;
  stormCtx.fillRect(0, 0, stormWidth, stormHeight);

  stormCtx.strokeStyle = "rgba(244, 203, 115, 0.84)";
  stormCtx.lineWidth = 3;
  stormCtx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120;
    const x = t * stormWidth;
    const wave = Math.sin(t * 18 + time * 0.002) * 34 + Math.sin(t * 43) * 16;
    const trend = stormHeight * (0.34 + t * 0.24);
    const y = trend + wave;
    if (i === 0) stormCtx.moveTo(x, y);
    else stormCtx.lineTo(x, y);
  }
  stormCtx.stroke();

  stormCtx.strokeStyle = "rgba(255, 242, 214, 0.28)";
  stormCtx.lineWidth = 1;
  for (let i = 0; i < 12; i += 1) {
    const x = ((time * 0.04 + i * 97) % (stormWidth + 120)) - 60;
    stormCtx.beginPath();
    stormCtx.moveTo(x, 0);
    stormCtx.lineTo(x - 80, stormHeight);
    stormCtx.stroke();
  }
}

function animate(time) {
  drawBackground(time);
  drawStorm(time);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
