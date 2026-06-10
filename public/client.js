const socket = io();
let myLobbyId = "";
let myRole = "";
let timerInterval; 
let gamePlayers = []; 
let isAmHost = false; 

// Mode spectateur variables
let iAmSpectator = false;
let spectatorRoles = []; 

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function getPlayerName() { 
    const nameInput = document.getElementById('playerName');
    let name = nameInput.value.trim();
    if (!name) { name = `Joueur${Math.floor(Math.random()*1000)}`; nameInput.value = name; }
    return name; 
}

function startVisualTimer(seconds, label) {
    clearInterval(timerInterval);
    let timeLeft = seconds;
    const display = document.getElementById('timerDisplay');
    display.innerText = `${label}\n${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        display.innerText = `${label}\n${timeLeft}s`;
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            display.innerText = "⏱️ Fini !";
        }
    }, 1000);
}

function renderCircle(activePlayerId = null, isVotingPhase = false) {
    const container = document.getElementById('playerCircle');
    container.innerHTML = "";
    const total = gamePlayers.length;

    gamePlayers.forEach((player, i) => {
        const angle = (i / total) * 2 * Math.PI - (Math.PI / 2);
        const radiusPercent = 40; 
        const x = 50 + Math.cos(angle) * radiusPercent;
        const y = 50 + Math.sin(angle) * radiusPercent;

        let extraHtml = "";
        if (isVotingPhase && player.isAlive && player.id !== socket.id && !iAmSpectator) {
            extraHtml = `<button class="btn-vote" onclick="submitVote('${player.id}')">Voter</button>`;
        }

        // Si je suis spectateur, je vois les rôles des joueurs vivants (et morts) !
        let roleHtml = "";
        if (iAmSpectator) {
            const specData = spectatorRoles.find(pr => pr.id === player.id);
            if (specData) roleHtml = `<div class="role-text">${specData.role}</div>`;
        }

        const isActive = player.id === activePlayerId ? "active" : "";
        const isDead = !player.isAlive ? "dead" : "";
        const wordText = player.writtenWord ? player.writtenWord : "...";

        const node = document.createElement('div');
        node.className = `player-node ${isActive} ${isDead}`;
        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
        
        node.innerHTML = `
            <div class="avatar">👤</div>
            <div class="player-name">${player.name}</div>
            <div class="player-word" id="word-${player.id}">${player.writtenWord !== undefined ? wordText : ""}</div>
            ${roleHtml}
            ${extraHtml}
        `;
        container.appendChild(node);
    });
}

function updateLobbyUI(players) {
    gamePlayers = players; 
    const playerCountDisplay = document.getElementById('playerCountDisplay');
    playerCountDisplay.innerText = players.length;

    const grid = document.getElementById('playerGrid');
    grid.innerHTML = ""; 

    players.forEach(p => {
        const pCase = document.createElement('div');
        pCase.className = 'player-case';
        if (p.id === socket.id) pCase.classList.add('current-player');

        let hostCrownHtml = "";
        if (p.isHost) hostCrownHtml = `<span class="host-crown">👑</span>`;

        pCase.innerHTML = `
            ${hostCrownHtml}
            <div class="lobby-avatar">👤</div>
            <div class="lobby-name">${p.name}</div>
        `;
        grid.appendChild(pCase);
    });
}

function updateThemeList(themes) {
    const select = document.getElementById('themeSelect');
    select.innerHTML = ""; 
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme; option.text = theme;
        select.add(option);
    });
}

// ---- CONNEXION & DÉCONNEXION ----
function createLobby() { socket.emit('createLobby', getPlayerName()); }
function joinPublicLobby(lobbyId) { socket.emit('joinLobby', { lobbyId, playerName: getPlayerName() }); }

socket.on('updatePublicLobbies', (lobbies) => {
    const list = document.getElementById('publicLobbiesList');
    list.innerHTML = "";
    if (lobbies.length === 0) list.innerHTML = "<li>Aucune partie en attente. Créez-en une !</li>";
    else lobbies.forEach(l => list.innerHTML += `<li onclick="joinPublicLobby('${l.id}')">Rejoindre ${l.host} (${l.playersCount}/10 j)</li>`);
});

socket.on('lobbyJoined', (data) => {
    myLobbyId = data.lobbyId;
    isAmHost = data.isHost;
    document.getElementById('lobbyHostDisplay').innerText = data.players[0].name;
    if (isAmHost) document.getElementById('settingsPanel').style.display = 'block';
    
    updateThemeList(data.themes);
    updateLobbyUI(data.players);
    showScreen('screen-lobby');
});

socket.on('updatePlayers', updateLobbyUI);

socket.on('youAreHost', () => {
    isAmHost = true;
    document.getElementById('settingsPanel').style.display = 'block';
});

function leaveLobby() {
    socket.emit('leaveLobby');
}
socket.on('leftLobby', () => {
    myLobbyId = "";
    isAmHost = false;
    document.getElementById('settingsPanel').style.display = 'none';
    showScreen('screen-home');
});

// ---- JEU ----
function startGame() {
    const undercovers = parseInt(document.getElementById('nbUndercovers').value);
    const mrWhites = parseInt(document.getElementById('nbMrWhites').value);
    const writeTime = parseInt(document.getElementById('writeTime').value);
    const discussTime = parseInt(document.getElementById('discussTime').value);
    const themeName = document.getElementById('themeSelect').value;
    socket.emit('startGame', { lobbyId: myLobbyId, undercovers, mrWhites, writeTime, discussTime, themeName });
}

socket.on('gameStarted', (data) => {
    gamePlayers = data.players; 
    const me = gamePlayers.find(p => p.id === socket.id);
    myRole = me.role;
    
    // NOUVELLE LOGIQUE D'AFFICHAGE DU HAUT
    const topBadge = document.getElementById('topCenterBadge');
    if (myRole === 'mrwhite') {
        topBadge.style.color = 'var(--accent)';
        topBadge.innerText = `Rôle: MR WHITE`;
    } else {
        // L'undercover et le civil voient la même chose !
        topBadge.style.color = 'var(--primary)';
        topBadge.innerText = `Mot Secret: ${me.word}`;
    }

    // Reset du mode spectateur en cas de relance
    iAmSpectator = false;
    spectatorRoles = [];
    document.getElementById('spectatorPanel').style.display = 'none';
    
    renderCircle();
    showScreen('screen-game');
});

socket.on('updateTurn', ({ activePlayerId, writeTime }) => {
    if(!iAmSpectator) startVisualTimer(writeTime, "L'ordre écrit...");
    renderCircle(activePlayerId); 

    const myTurnSection = document.getElementById('myTurnSection');
    if (activePlayerId === socket.id && !iAmSpectator) {
        myTurnSection.style.display = 'block';
        document.getElementById('wordInput').focus();
    } else {
        myTurnSection.style.display = 'none';
    }
});

function submitWord() {
    const word = document.getElementById('wordInput').value;
    if(word.trim() === "") return alert("Écris un mot !");
    socket.emit('submitWord', { lobbyId: myLobbyId, word });
    document.getElementById('myTurnSection').style.display = 'none';
    document.getElementById('wordInput').value = "";
}

socket.on('wordWritten', ({ playerId, word }) => {
    const player = gamePlayers.find(p => p.id === playerId);
    if(player) player.writtenWord = word;
    const wordDiv = document.getElementById(`word-${playerId}`);
    if(wordDiv) wordDiv.innerText = word;
});

// ANNONCE D'ÉLIMINATION PUBLIQUE
socket.on('playerEliminated', (data) => {
    const overlay = document.getElementById('deathOverlay');
    overlay.innerHTML = `💀 ${data.name} a été éliminé(e) !<br><br><span style="font-size:14px; font-weight:normal;">Il/Elle était</span><br>${data.role.toUpperCase()}`;
    overlay.style.display = 'block';
    setTimeout(() => { overlay.style.display = 'none'; }, 5000);
});

// PASSAGE EN MODE SPECTATEUR PRIVÉ
socket.on('youAreSpectator', (data) => {
    iAmSpectator = true;
    spectatorRoles = data.playersRoles;
    
    document.getElementById('specCivilWord').innerText = data.civilWord;
    document.getElementById('specUnderWord').innerText = data.undercoverWord;
    document.getElementById('spectatorPanel').style.display = 'block';
    document.getElementById('timerDisplay').innerText = "Tu es spectateur...";
    
    renderCircle(); // Met à jour le cercle pour afficher les rôles
});

socket.on('startVoting', (data) => {
    gamePlayers = data.players; 
    document.getElementById('myTurnSection').style.display = 'none';
    if(!iAmSpectator) startVisualTimer(data.discussTime, "Débat et Vote");
    renderCircle(null, true);
});

function submitVote(targetId) {
    socket.emit('submitVote', { lobbyId: myLobbyId, targetId });
    renderCircle(null, false); 
    document.getElementById('timerDisplay').innerText = "Vote pris !";
}

socket.on('nextTurn', (data) => {
    gamePlayers = data.players; 
    renderCircle();
});

socket.on('mrWhiteGuess', (data) => {
    clearInterval(timerInterval);
    if (myRole === 'mrwhite') {
        document.getElementById('mwMessage').innerText = data.message;
        document.getElementById('mwGuessInput').value = ""; 
        showScreen('screen-mrwhite');
    } else {
        document.getElementById('timerDisplay').innerText = data.tries === 2 ? "Mr White devine le mot..." : "Mr White s'est trompé, 2ème essai...";
    }
});

function submitMwGuess() {
    const guess = document.getElementById('mwGuessInput').value;
    socket.emit('mrWhiteSubmitGuess', { lobbyId: myLobbyId, guess });
}

// ---- GESTION FIN DE PARTIE & RECAP ----
socket.on('gameOver', (data) => {
    clearInterval(timerInterval);
    document.getElementById('winMessage').innerText = data.message;
    document.getElementById('btnReturnLobby').style.display = isAmHost ? 'block' : 'none';
    
    // Génération du contenu HTML pour le Récap
    const r = data.recap;
    let recapHtml = `
        <strong>Mot Civils :</strong> <span class="highlight">${r.civilWord}</span><br>
        <strong>Mot Undercover :</strong> <span class="highlight">${r.undercoverWord}</span><br>
        <hr>
    `;
    
    if (r.mrWhiteGuesses.length > 0) {
        recapHtml += `<strong>Tentatives Mr White :</strong> ${r.mrWhiteGuesses.join(' - ')}<br><hr>`;
    }

    r.players.forEach(p => {
        let roleBadge = p.role === 'mrwhite' ? 'MR WHITE' : (p.role === 'undercover' ? 'UNDERCOVER' : 'CIVIL');
        let wordsPlayed = p.words.length > 0 ? p.words.join(', ') : 'Aucun mot';
        recapHtml += `<strong>${p.name}</strong> (${roleBadge}) : ${wordsPlayed}<br>`;
    });

    document.getElementById('recapSection').innerHTML = recapHtml;
    
    // Reset le mode spectateur avant l'écran de fin
    document.getElementById('spectatorPanel').style.display = 'none';

    showScreen('screen-end');
});

function returnToLobby() {
    socket.emit('returnToLobby', myLobbyId);
}

socket.on('forceBackToLobby', () => {
    showScreen('screen-lobby');
});

socket.on('error', (msg) => { alert(msg); });