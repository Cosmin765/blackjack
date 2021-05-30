window.onload = main;

const $ = name => document.querySelector(name);
const $$ = name => document.querySelectorAll(name);
const map = (x, a, b, c, d) => (x - a) / (b - a) * (d - c) + c;

let cardCount = 0;
const ids = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
const types = [ "heart", "club", "diamond", "spade" ];

function updateTotal()
{
    const sum = [...$$(".card .value")].reduce((acc, el) => acc + getValue(el.innerHTML), 0);

    $(".total").innerHTML = `Total: ${sum}`;
}

function createCard()
{
    const card = document.createElement("div");
    card.className = "card";

    // events
    card.addEventListener("mouseenter", () => card.style.transform += "translateY(-80%)");
    card.addEventListener("mouseleave", () => card.style.transform = card.style.transform.replace("translateY(-80%)", ""));

    const infoEl = document.createElement("div");
    infoEl.className = "info";
    card.append(infoEl);

    // the value of the card
    const valueEl = document.createElement("div");
    valueEl.className = "value";
    valueEl.innerHTML = ids[(Math.random() * 13) | 0];

    infoEl.append(valueEl);

    // the type of the card ( i know it doesn't matter, but it's my code and I do what I want )
    const typeEl = document.createElement("img");
    typeEl.className = "type";
    typeEl.src = `./assets/${types[(Math.random() * 4) | 0]}.png`;

    infoEl.append(typeEl);

    return card;
}

function getValue(id) {
    if(!isNaN(id))
        return parseInt(id);

    const table = { 'A': 1, 'J': 12, 'Q': 13, 'K': 14 };
    return table[id];
}

function main()
{
    setupEvents();
}

function takeCard()
{
    const lim = cardCount * 12;
    $$(".card").forEach((card, i) => {
        card.style.transform = `rotate(${map(i, 0, cardCount, -lim, lim)}deg)`;
    });

    const card = createCard();
    card.style.transform = `rotate(${lim}deg)`;
    $(".cards-container").append(card);
    cardCount++;

    updateTotal();
}

function setupEvents()
{
    $(".take").addEventListener("click", takeCard);
}