window.onload = main;

const $ = name => document.querySelector(name);
const $$ = name => document.querySelectorAll(name);
const map = (x, a, b, c, d) => (x - a) / (b - a) * (d - c) + c;

let cardCount = 0;
const ids = [ 'A', '2', '3', '4', '5',' 6', '7', '8', '9', '10', 'J', 'Q', 'K' ];
const types = [ "heart", "club", "diamond", "spade" ];

const available = [];

function updateTotal()
{
    const sum = [...$$(".card .value")].reduce((acc, el) => acc + getValue(el.innerHTML), 0);

    $(".total").innerHTML = `Total: ${sum}`;
}

function createCard()
{
    const card = document.createElement("div");
    card.className = "card";
    
    const frontface = document.createElement("div");
    frontface.className = "frontface";
    card.append(frontface);

    // events
    card.addEventListener("mouseenter", () => card.style.transform += "translateY(-80%)");
    card.addEventListener("mouseleave", () => card.style.transform = card.style.transform.replace("translateY(-80%)", ""));
    
    // the container for the info
    const infoEl = document.createElement("div");
    infoEl.className = "info";
    frontface.append(infoEl);

    // the value of the card
    const valueEl = document.createElement("div");
    valueEl.className = "value";
    const id = ids[(Math.random() * ids.length) | 0];
    valueEl.innerHTML = id;

    infoEl.append(valueEl);

    // the type of the card ( i know it doesn't matter, but it's my code and I do what I want )
    const typeEl = document.createElement("img");
    typeEl.className = "type";
    const index = (Math.random() * available[id].length) | 0;
    typeEl.src = `./assets/${available[id][index]}.png`;
    
    if(["heart", "diamond"].includes(available[id][index])) {
      valueEl.style.color = "#ff0000";
    }
    
    available[id].splice(index, 1);
    
    if(!available[id].length) {
      ids.splice(ids.indexOf(id), 1);
    }

    infoEl.append(typeEl);
    
    const backface = document.createElement("div");
    backface.className = "backface";
    card.append(backface);

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
    for(const id of ids)
      available[id] = [...types];
  
    setupEvents();
}

function takeCard()
{
    const lim = cardCount * 12;

    const card = createCard();
    setTimeout(() => {
      $$(".card").forEach((card, i) => {
        card.style.transform = `rotate(${map(i, 0, cardCount, -lim, lim)}deg)`;
      });
      
      card.style.transform = `rotate(${lim}deg)`;
      cardCount++;

      updateTotal();
      
      setTimeout(() => {
        for(const el of card.children) {
          if(el.className === "backface") {
            el.style.display = "none";
            break;
          }
        }
      }, 250);
    }, 300);
    $(".cards-container").append(card);
}

function setupEvents()
{
    $(".take").addEventListener("click", takeCard);
}