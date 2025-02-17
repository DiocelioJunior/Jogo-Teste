let currentTimer;
let players = [];
let currentPlayerIndex = 0;
let startTime;

const playerImageInput = document.getElementById("playerImageSelect");

playerImageInput.addEventListener("click", () =>{
    const playerImage = document.getElementById("playerImageSelect").value;
    const playerImageSelect = document.getElementById("image-player")
    playerImageSelect.src = playerImage
});

function showGamePanel() {
    document.getElementById("gamePanel").style.display = "flex";
    document.getElementById("playerSetup").style.display = "none";
}


// Função para adicionar jogadores
function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    const playerImage = document.getElementById("playerImageSelect").value;

    addEventListener
    if (playerName && players.length < 4) {
        players.push({ name: playerName, image: playerImage, score: 0 });
        updatePlayerList();
        document.getElementById("playerName").value = "";

        if (players.length === 4) {
            document.getElementById("playerSetup").style.display = "none";
            document.getElementById("gamePanel").style.display = "block";
            updateScoreboard();
        }
    } else if (players.length >= 4) {
        alert("Máximo de 4 jogadores atingido!");
    }
}

// Atualiza a lista de jogadores
function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = players.map((player, index) => `
        <li>
            <img src="${player.image}" alt="${player.name}" class="player-icon">
            <p>${player.name}</p>
        </li>
    `).join("");
}

// Atualiza o painel de pontuação
function updateScoreboard() {
    const scoreboard = document.getElementById("playersScore");
    scoreboard.innerHTML = players.map((player, index) => `
        <div class="player-score ${index === currentPlayerIndex ? 'active' : ''}">
            <img src="${player.image}" alt="${player.name}" class="player-icon">
            ${player.name}: ${player.score} pontos
        </div>
    `).join("");
}

// Iniciar o Timer para o Desafio
function startChallengeTimer() {
    let timeLeft = 120; // Tempo total
    startTime = Date.now(); // Armazena o momento em que o desafio começou
    document.getElementById("timerDisplay").innerText = `⏳ Tempo: ${timeLeft}s`;

    clearInterval(currentTimer); // Para o timer anterior, se houver

    currentTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("timerDisplay").innerText = `⏳ Tempo: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(currentTimer);
            document.getElementById("challengeContent").innerHTML +=
                "<div class='penalty'>⏳ Tempo esgotado! Volte 2 casas.</div>";
        }
    }, 1000);
}

// Concluir Desafio e Somar Pontos
function completeChallenge() {
    clearInterval(currentTimer); // Para o timer

    let endTime = Date.now(); // Captura o momento de conclusão
    let timeElapsed = Math.floor((endTime - startTime) / 1000); // Calcula tempo gasto em segundos

    // Define a pontuação com base no tempo gasto
    let pointsEarned = timeElapsed <= 60 ? 25 : 15;
    players[currentPlayerIndex].score += pointsEarned;

    updateScoreboard();
    nextPlayer();
}


// Event Listeners para os botões
document.getElementById("startChallengeBtn").addEventListener("click", startChallengeTimer);
document.getElementById("completeChallengeBtn").addEventListener("click", completeChallenge);


// Função para rolar o dado
function rollDice() {
    const dice = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    let rolls = 0;
    const animation = setInterval(() => {
        document.getElementById("diceResult").textContent = dice[Math.floor(Math.random() * 6)];
        rolls++;
        if (rolls > 10) {
            clearInterval(animation);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            document.getElementById("diceResult").textContent = `Resultado: ${finalRoll}`;
            movePlayer(finalRoll);
        }
    }, 100);
}

// Função para mover o jogador (simulação)
function movePlayer(spaces) {
    players[currentPlayerIndex].score += spaces;
    updateScoreboard();
    nextPlayer();
}

// Passa a vez para o próximo jogador
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateScoreboard();
}

// Função para carregar JSON
async function loadJSON(category) {
    try {
        const response = await fetch(`data/${category}.json`);
        const data = await response.json();
        return data[category];
    } catch (error) {
        console.error('Erro ao carregar JSON:', error);
        return [];
    }
}

// Função para sortear desafios
async function drawChallenge(category) {
    clearInterval(currentTimer);
    const challenges = await loadJSON(category);

    if (!challenges || challenges.length === 0) {
        showError();
        return;
    }

    const desafio = challenges[Math.floor(Math.random() * challenges.length)];
    displayChallenge(desafio);

    if (category === 'pregação') startTimer(120);
}

// Função para sortear penalidades
async function drawPenalty() {
    const penalidades = await loadJSON('penalidades');

    if (!penalidades || penalidades.length === 0) {
        showError();
        return;
    }

    const penalidade = penalidades[Math.floor(Math.random() * penalidades.length)];
    displayPenalty(penalidade);
}

// Função para exibir desafios
function displayChallenge(desafio) {
    let content = `
        <div class="scene-challenge"><span class="material-symbols-outlined">person</span>${desafio.scene}</div>
        <div class="challenge-card"><span class="material-symbols-outlined">help</span>${desafio.challenge}</div>
    `;

    if (desafio.answer) {
        content += `<div class="answer"><span class="material-symbols-outlined">lightbulb</span>Resposta: ${desafio.answer}</div>`;
    }

    content += `<div class="reference"><span class="material-symbols-outlined"> menu_book</span></button>${desafio.reference}</div>`;
    document.getElementById("challengeContent").innerHTML = content;
}

// Função para exibir penalidades
function displayPenalty(penalidade) {
    const content = `
        <div class="penalty">⚠️ ${penalidade.scene}</div>
        <div class="effect">${penalidade.effect}</div>
        <div class="reference">📖 ${penalidade.reference}</div>
    `;
    document.getElementById("challengeContent").innerHTML = content;
}

// Função para zerar o tempo
function resetTimer() {
    clearInterval(currentTimer); // Para o timer
    document.getElementById("timerDisplay").innerText = "⏳ Tempo: 0s"; // Reseta a exibição
}

// Event Listener para o botão de zerar tempo
document.getElementById("resetTimerBtn").addEventListener("click", resetTimer);

// Função para exibir erro
function showError() {
    document.getElementById("challengeContent").innerHTML =
        "<div class='error'>❌ Erro ao carregar desafio. Tente novamente!</div>";
}

function rollDice() {
    let dice = document.getElementById("dice");

    // Define rotação para cada face
    let rotations = [
        { x: 0, y: 0 },    // 1 (frente)
        { x: 180, y: 0 },  // 2 (atrás)
        { x: 0, y: -90 },  // 3 (direita)
        { x: 0, y: 90 },   // 4 (esquerda)
        { x: -90, y: 0 },  // 5 (cima)
        { x: 90, y: 0 }    // 6 (baixo)
    ];

    let roll = Math.floor(Math.random() * 6); // Sorteia um número de 0 a 5
    let side = rotations[roll];

    // Gira rapidamente antes de parar no número final
    let randomX = Math.floor(Math.random() * 1000) - 500;
    let randomY = Math.floor(Math.random() * 1000) - 500;

    dice.style.transition = "transform 0.3s linear"; // Gira rápido primeiro
    dice.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;

    setTimeout(() => {
        dice.style.transition = "transform 1s ease-in-out"; // Suaviza para a face final
        dice.style.transform = `rotateX(${side.x}deg) rotateY(${side.y}deg)`;
    }, 300);
}
