// Punktestand des Dealers
let dealerSum = 0;

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
};

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

// Startet das Spiel
function startGame() {

    // Dealer erhält eine verdeckte Karte
    hidden = deck.pop();

    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // Dealer zieht Karten bis mindestens 17 Punkte erreicht sind
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");

        let card = deck.pop();

        cardImg.src = "./cards/" + card + ".png";

        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);

        document.getElementById("dealer-cards").append(cardImg);
    }

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

    document.getElementById("dealer-sum").innerText = dealerSum;
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
