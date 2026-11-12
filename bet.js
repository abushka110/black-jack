let coins = 1000;

document.getElementById("coins").innerText = coins;

function startGame(bet) {

    if (bet > coins) {
        alert("Nicht genügend KeckCoins!");
        return;
    }

    localStorage.setItem("coins", coins);
    localStorage.setItem("bet", bet);

    window.location.href = "index.html";
}
