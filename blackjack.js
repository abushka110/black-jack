// KeckCoinszustand
let playerCoins = 0;
let currentBet = 0;

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

    playerCoins =
        parseInt(localStorage.getItem("coins")) || 1000;

    currentBet =
        parseInt(localStorage.getItem("bet")) || 0;

    document.getElementById("coins-display").innerText =
        "Guthaben: " + playerCoins + " KeckCoins";

    document.getElementById("bet-display").innerText =
        "Einsatz: " + currentBet + " KeckCoins";

    buildDeck();
    shuffleDeck();
    startGame();

    document.getElementById("hit")
        .addEventListener("click", hit);

    document.getElementById("stay")
        .addEventListener("click", stay);

    document.getElementById("new-game")
        .addEventListener("click", resetGame);

    document.getElementById("back-to-bet")
        .addEventListener("click", goToBetSelection)
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
    // Spielbuttons wieder aktivieren
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;

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

// Zur Seite für die Einsatz-Auswahl zurückkehren
function goToBetSelection() {

    // Aktuelles Guthaben speichern
    localStorage.setItem("coins", playerCoins);

    // Einsatz zurücksetzen
    localStorage.removeItem("bet");

    // Zur Einsatzseite wechseln
    window.location.href = "bet.html";
}

function sleep(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
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

// Prüft den Spielausgang
// Rückgabewerte:
// "win"  = Spieler gewinnt
// "lose" = Dealer gewinnt
// "tie"  = Unentschieden
function evaluateGame() {

    // Endgültige Punktzahl des Dealers berechnen
    const finalDealerSum =
        reduceAce(dealerSum, dealerAceCount);

    // Endgültige Punktzahl des Spielers berechnen
    const finalYourSum =
        reduceAce(yourSum, yourAceCount);

    // Spieler hat sich überkauft
    if (finalYourSum > 21) {
        return "lose";
    }

    // Dealer hat sich überkauft
    if (finalDealerSum > 21) {
        return "win";
    }

    // Gleiche Punktzahl
    if (finalYourSum === finalDealerSum) {
        return "tie";
    }

    // Spieler hat mehr Punkte
    if (finalYourSum > finalDealerSum) {
        return "win";
    }

    // Dealer hat mehr Punkte
    return "lose";
}

// Beendet das Spiel
// Passt das Guthaben an
// Aktualisiert die Anzeige
function finishGame(result) {

    // Spieler darf keine Karten mehr ziehen
    canHit = false;
    
    // Spielbuttons deaktivieren
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    let message = "";

    switch (result) {

        // Spieler gewinnt
        case "win":

            // Einsatz zum Guthaben hinzufügen
            playerCoins += currentBet;
            message = "Gewonnen";
            break;

        // Dealer gewinnt
        case "lose":

            // Einsatz vom Guthaben abziehen
            playerCoins -= currentBet;
            message = "Dealer gewinnt";
            break;

        // Unentschieden
        case "tie":

            // Guthaben bleibt unverändert
            message = "Unentschieden";
            break;
    }

    // Neues Guthaben speichern
    localStorage.setItem("coins", playerCoins);

    // Guthaben auf der Webseite aktualisieren
    document.getElementById("coins-display").innerText =
        "Guthaben: " + playerCoins + " KeckCoins";

    // Finale Dealer-Punktzahl anzeigen
    document.getElementById("dealer-sum").innerText =
        reduceAce(dealerSum, dealerAceCount);

    // Finale Spieler-Punktzahl anzeigen
    document.getElementById("your-sum").innerText =
        reduceAce(yourSum, yourAceCount);

    // Ergebnis anzeigen
    document.getElementById("results").innerText =
        message;
}

// Startet das Spiel
function startGame() {

    // Prüft ob genügend KeckCoins vorhanden sind
    if (playerCoins < currentBet) {

        document.getElementById("results").innerText =
            "Nicht genügend KeckCoins für diesen Einsatz.";
        
        // TODO: an Guthaben Aufladung Seite senden
        
        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;

        return;
    }
    
    // Dealer erhält eine verdeckte Karte
    hidden = deck.pop();

    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
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

    // Punkte direkt anzeigen
    updateScoreDisplay();
}

// Spieler zieht eine weitere Karte
function hit() {

    // Falls keine weitere Karte gezogen werden darf
    if (!canHit) {
        return;
    }

    // Neues Kartenbild erzeugen
    let cardImg = document.createElement("img");

    // Oberste Karte vom Deck ziehen
    let card = deck.pop();

    // Kartenbild setzen
    cardImg.src = "./cards/" + card + ".png";

    // Punkte des Spielers erhöhen
    yourSum += getValue(card);

    // Anzahl der Asse aktualisieren
    yourAceCount += checkAce(card);

    // Karte anzeigen
    document.getElementById("your-cards").append(cardImg);

    // Punkteanzeige aktualisieren
    updateScoreDisplay();

    // Prüfen ob Spieler über 21 Punkte hat
    if (reduceAce(yourSum, yourAceCount) > 21) {

        // Dealer-Karte aufdecken
        document.getElementById("hidden").src =
            "./cards/" + hidden + ".png";

        // Spiel sofort verloren
        finishGame("lose");
    }
}

// Spieler bleibt stehen und Runde wird ausgewertet
// Dealer zieht nun Karten
async function stay() {

    // Spieler darf keine Karten mehr ziehen
    canHit = false;

    // Verdeckte Dealer-Karte aufdecken
    document.getElementById("hidden").src =
        "./cards/" + hidden + ".png";

    // Dealer zieht solange bis mindestens 17 Punkte erreicht sind
    while (reduceAce(dealerSum, dealerAceCount) < 17) {

        // 1 Sekunde warten
        await sleep(1000);

        // Karte ziehen
        let card = deck.pop();

        // Dealer-Punkte erhöhen
        dealerSum += getValue(card);

        // Dealer-Asse erhöhen
        dealerAceCount += checkAce(card);

        // Kartenbild erzeugen
        let cardImg = document.createElement("img");

        // Bildquelle setzen
        cardImg.src = "./cards/" + card + ".png";

        // Karte anzeigen
        document.getElementById("dealer-cards").append(cardImg);

        // Dealer-Punkte aktualisieren
        document.getElementById("dealer-sum").innerText =
            reduceAce(dealerSum, dealerAceCount);
    }

    // Gewinner bestimmen
    const result = evaluateGame();

    // Spiel beenden
    finishGame(result);
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
