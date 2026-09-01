const rarities = [
    {
        name: "Mẹ",
        chance: 60,
        emoji: "⚪",
        color: "#bdbdbd"
    },
    {
        name: "Mẹ và Bố",
        chance: 25,
        emoji: "🟢",
        color: "#55efc4"
    },
    {
        name: "Mẹ Đá Bóng",
        chance: 10,
        emoji: "🔵",
        color: "#74b9ff"
    },
    {
        name: "Mẹ Báo",
        chance: 4,
        emoji: "🟣",
        color: "#a29bfe"
    },
    {
        name: "Mẹ Miền Tây",
        chance: 0.9,
        emoji: "🟡",
        color: "#ffeaa7"
    },
    {
        name: "Mẹ Hải Phòng",
        chance: 0.09,
        emoji: "🔴",
        color: "#ff7675"
    },
    {
        name: "Mẹ Bạn",
        chance: 0.01,
        emoji: "⚫",
        color: "#251309"
    }
];

let rollCount = Number(localStorage.getItem("rollCount")) || 0;
let bestIndex = Number(localStorage.getItem("bestIndex"));

if (isNaN(bestIndex)) {
    bestIndex = -1;
}

let history = JSON.parse(
    localStorage.getItem("history") || "[]"
);

const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");

const result = document.getElementById("result");
const rarityText = document.getElementById("rarity");

const rollCountText = document.getElementById("rollCount");
const bestRarityText = document.getElementById("bestRarity");

const historyList = document.getElementById("historyList");


function getRandomRarity() {

    const random = Math.random() * 100;

    let current = 0;

    for (let i = 0; i < rarities.length; i++) {

        current += rarities[i].chance;

        if (random < current) {
            return i;
        }
    }

    return 0;
}


function updateStats() {

    rollCountText.textContent = rollCount;

    if (bestIndex >= 0) {
        bestRarityText.textContent =
            rarities[bestIndex].name;
    } else {
        bestRarityText.textContent = "None";
    }
}


function updateHistory() {

    if (history.length === 0) {
        historyList.innerHTML =
            "Chưa có lần roll nào.";

        return;
    }

    historyList.innerHTML = "";

    history.forEach(item => {

        const div = document.createElement("div");

        div.className = "history-item";

        div.textContent =
            `${item.emoji} ${item.name}`;

        div.style.color = item.color;

        historyList.appendChild(div);
    });
}


function saveGame() {

    localStorage.setItem(
        "rollCount",
        rollCount
    );

    localStorage.setItem(
        "bestIndex",
        bestIndex
    );

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );
}


function roll() {

    if (rollBtn.disabled) return;

    rollBtn.disabled = true;

    result.classList.add("rolling");

    rarityText.textContent = "ĐANG ROLL...";

    let animationTime = 1000;

    let animation = setInterval(() => {

        const randomIndex =
            Math.floor(Math.random() * rarities.length);

        result.textContent =
            rarities[randomIndex].emoji;

    }, 80);


    setTimeout(() => {

        clearInterval(animation);

        const index = getRandomRarity();
        const item = rarities[index];

        rollCount++;

        result.classList.remove("rolling");

        result.textContent = item.emoji;

        rarityText.textContent = item.name;

        rarityText.style.color = item.color;

        result.style.borderColor = item.color;

        if (index > bestIndex) {
            bestIndex = index;
        }

        history.unshift({
            name: item.name,
            emoji: item.emoji,
            color: item.color
        });

        history = history.slice(0, 10);

        updateStats();
        updateHistory();
        saveGame();

        rollBtn.disabled = false;

    }, animationTime);
}


rollBtn.addEventListener("click", roll);


resetBtn.addEventListener("click", () => {

    const confirmReset =
        confirm("Bạn thích láo nháo không🔪?");

    if (!confirmReset) return;

    rollCount = 0;
    bestIndex = -1;
    history = [];

    result.textContent = "?";

    rarityText.textContent =
        "ROLL ĐỂ BẮT ĐẦU";

    rarityText.style.color = "white";

    result.style.borderColor = "#55557c";

    updateStats();
    updateHistory();
    saveGame();
});


updateStats();
updateHistory();
