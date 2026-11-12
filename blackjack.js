// Punktestand des Dealers
let dealerSum = 0;
// Punktestand des Dealers die man sehen darf
let dealerVisibleSum = 0;

// Punktestand des Spielers
let yourSum = 0;

// Anzahl der Asse beim Dealer
let dealerAceCount = 0;

// Anzahl der Asse beim Spieler
let yourAceCount = 0;

// Verdeckte Karte des Dealers
let hidden;

// Enthält das Kartendeck
let deck;

// true = Spieler darf weitere Karten ziehen
// false = Spieler darf keine Karten mehr ziehen
let canHit = true;

// Wird ausgeführt, sobald die Webseite geladen ist
window.onload = function () {

    buildDeck();
    shuffleDeck();

    startGame();

    document
        .getElementById("new-game")
        .addEventListener("click", resetGame);
};

// Neue Spiel starten
function resetGame() {

    // Werte zurücksetzen
    dealerSum = 0;
    dealerVisibleSum = 0;
    yourSum = 0;

    dealerAceCount = 0;
    yourAceCount = 0;

    canHit = true;

    // Spielbereich leeren
    document.getElementById("dealer-cards").innerHTML =
        '<img id="hidden" src="./cards/BACK.png">';

    document.getElementById("your-cards").innerHTML = "";

    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";

    document.getElementById("results").innerText = "";

    // Neues Deck
    buildDeck();
    shuffleDeck();

    startGame();
}

// Erstellt ein Standarddeck mit 52 Karten
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];

    deck = [];

    // Für jede Kartenfarbe
    for (let i = 0; i < types.length; i++) {
        // Für jeden Kartenwert
        for (let j = 0; j < values.length; j++) {
            // Beispiel: A-C, 10-H, K-S
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

// Mischt das Kartendeck zufällig
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);

        // Kartenpositionen tauschen
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    console.log(deck);
}

function updateScoreDisplay() {
    document.getElementById("dealer-sum").innerText = dealerVisibleSum;

    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
}

// Startet das Spiel
function startGame() {

    // Dealer erhält eine verdeckte Karte
    hidden = deck.pop();

    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // Dealer zieht Karten bis mindestens 17 Punkte erreicht sind
    /* while (dealerSum < 17) {
        let cardImg = document.createElement("img");

        let card = deck.pop();

        cardImg.src = "./cards/" + card + ".png";

        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);

        if(dealerVisibleSum === 0) {
            dealerVisibleSum = getValue(card);
        }

        document.getElementById("dealer-cards").append(cardImg);
    } */
   // sichtbare Karte
   let visibleCard = deck.pop();

   dealerVisibleSum = getValue(visibleCard);

   dealerSum += getValue(visibleCard);
   dealerAceCount += checkAce(visibleCard);

   let cardImg = document.createElement("img");
   cardImg.src = "./cards/" + visibleCard + ".png";

   document.getElementById("dealer-cards").append(cardImg);

    // Spieler erhält zwei Startkarten
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");

        let card = deck.pop();

        cardImg.src = "./cards/" + card + ".png";

        yourSum += getValue(card);
        yourAceCount += checkAce(card);

        document.getElementById("your-cards").append(cardImg);
    }

    // Button-Events registrieren
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

    // Punkte direkt anzeigen
    updateScoreDisplay();
}

// Spieler zieht eine weitere Karte
function hit() {

    // Falls Ziehen nicht erlaubt ist -> sofort beenden
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");

    let card = deck.pop();

    cardImg.src = "./cards/" + card + ".png";

    yourSum += getValue(card);
    yourAceCount += checkAce(card);

    document.getElementById("your-cards").append(cardImg);

    // Punkte sofort aktualisieren
    updateScoreDisplay();

    // Ass-Werte korrigieren und Bust prüfen
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

// Spieler bleibt stehen und Runde wird ausgewertet
function stay() {

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;

    // Verdeckte Karte des Dealers anzeigen
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    // Dealer zieht Karten bis mindestens 17 Punkte erreicht sind
    while (reduceAce(dealerSum, dealerAceCount) < 17) {

        let card = deck.pop();
    
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
    
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png";
    
        document.getElementById("dealer-cards").append(cardImg);
    }

    let message = "";

    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You Win!";
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = reduceAce(dealerSum, dealerAceCount);
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

// Ermittelt den Wert einer Karte
function getValue(card) {

    // Beispiel: "10-H" -> ["10", "H"]
    let data = card.split("-");
    let value = data[0];

    // Ass, Bube, Dame, König
    if (isNaN(value)) {

        if (value === "A") {
            return 11;
        }

        return 10;
    }

    return parseInt(value);
}

// Prüft, ob eine Karte ein Ass ist
function checkAce(card) {

    if (card[0] === "A") {
        return 1;
    }

    return 0;
}

// Wandelt Asse von 11 auf 1 um, falls nötig
function reduceAce(playerSum, playerAceCount) {

    while (playerSum > 21 && playerAceCount > 0) {

        // 11 -> 1 entspricht -10 Punkten
        playerSum -= 10;

        // Ein Ass wurde verwendet
        playerAceCount--;
    }

    return playerSum;
}
