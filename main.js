window.onload = main;

const $ = name => document.querySelector(name);
const $$ = name => document.querySelectorAll(name);
const map = (x, a, b, c, d) => (x - a) / (b - a) * (d - c) + c;

let cardCount = 0, cpuCardCount = 0;
let ids = [ 'A', '2', '3', '4', '5',' 6', '7', '8', '9', '10', 'J', 'Q', 'K' ];
const types = [ "heart", "club", "diamond", "spade" ];

let available = [];
let stopped = false;

let money = 1000;
let bet = 50;

function getByClass(el, name) {
  for(const child of el.children)
    if([...child.classList].includes(name))
      return child;

  return null;
}

const getSum = container => {
  let aceCount = 0;
  let sum = [...$$(`${container} .card .value`)].reduce((acc, el) => {
    aceCount += el.innerHTML === 'A';
    return acc + getValue(el.innerHTML);
  }, 0);

  while(aceCount--) {
    if(21 - sum >= 10)
      sum += 10;
    else break;
  }

  return sum;
};

function updateTotal()
{
    const playerSum = getSum(".cards-container");
    const cpuSum = getSum(".cpu-cards-container");

    $(".total").innerHTML = `Player Total: ${playerSum}`;
    $(".total").innerHTML += `<br>Cpu Total: ${stopped ? cpuSum : "???"}`;

    if(playerSum >= 21)
      stopGame();
}

function createCard()
{
    const card = document.createElement("div");
    card.className = "card";

    const frontface = document.createElement("div");
    frontface.className = "frontface";
    card.append(frontface);

    // events
    card.addEventListener("click", () => {
      if(!card.style.transform.includes("translateY(-80%)"))
        card.style.transform += "translateY(-80%)";
    });
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

    if(["heart", "diamond"].includes(available[id][index]))
      valueEl.style.color = "#ff0000";

    available[id].splice(index, 1);

    if(!available[id].length)
      ids.splice(ids.indexOf(id), 1);

    infoEl.append(typeEl);

    const backface = document.createElement("div");
    backface.className = "backface";
    card.append(backface);

    return card;
}

function getValue(id, container) {
    if(!isNaN(id))
        return parseInt(id);

    return ({ 'A': 1, 'J': 10, 'Q': 10, 'K': 10 })[id];
}

function main()
{
    for(const id of ids)
      available[id] = [...types];

    setupEvents();
}

function cpuTakeCard()
{
  const lim = cpuCardCount * 12;

    const card = createCard();
    setTimeout(() => {
      $$(".cpu-cards-container .card").forEach((card, i) => {
        card.style.transform = `rotate(${map(i, 0, cpuCardCount, -lim, lim)}deg)`;
      });

      if(stopped) getByClass(card, "backface").style.display = "none";

      card.style.transform = `rotate(${lim}deg)`;

      cpuCardCount++;
    }, 300);
    $(".cpu-cards-container").append(card);
}

const shouldCpuTake = () => 21 - getSum(".cpu-cards-container") >= 7;

function takeCard()
{
    if(stopped) return;

    const lim = cardCount * 12;

    const card = createCard();
    setTimeout(() => {
      $$(".cards-container .card").forEach((card, i) => {
        card.style.transform = `rotate(${map(i, 0, cardCount, -lim, lim)}deg)`;
      });

      card.style.transform = `rotate(${lim}deg)`;

      updateTotal();

      const backface = getByClass(card, "backface");
      setTimeout(() => backface.style.display = "none", 250);

      if(shouldCpuTake())
        cpuTakeCard();
      cardCount++;
    }, 300);
    $(".cards-container").append(card);
}

function getVerdict()
{
  const playerSum = getSum(".cards-container");
  const cpuSum = getSum(".cpu-cards-container");

  const lost = [ playerSum > 21, cpuSum > 21 ];

  if(lost[0] && lost[1] || playerSum === cpuSum) return "Draw";
  if(lost[0] && !lost[1]) return "You Lost";
  if(lost[1] && !lost[0]) return "You Won";
  if(playerSum < cpuSum) return "You Lost";
  else return "You Won";
}

function stopGame()
{
  if(stopped) return;
  
  stopped = true;
  $$(".cpu-cards-container .card").forEach(card => {
    getByClass(card, "backface").style.display = "none";
  });

  const promise = new Promise(resolve => {
    const inter = setInterval(() => {
      if(shouldCpuTake())
        cpuTakeCard();
      else {
        clearInterval(inter);
        resolve();
      }
    }, 1000);
  });

  promise.then(() => {
    updateTotal();

    const verdictEl = $(".verdict");
    verdictEl.style.transform = "scaleX(1)";
    verdictEl.innerHTML = getVerdict();
    switch(verdictEl.innerHTML) {
      case "Draw":
        verdictEl.style.color = "blue";
        verdictEl.style.border = "3px blue solid";
        break;
      case "You Won":
        verdictEl.style.color = "green";
        verdictEl.style.border = "3px blue solid";
        break;
      case "You Lost":
        verdictEl.style.color = "red";
        verdictEl.style.border = "3px red solid";
        break;
    }

    if(verdictEl.innerHTML === "You Won")
      money += bet;
    else if(verdictEl.innerHTML === "You Lost")
      money -= bet;
    $(".money").innerHTML = money;
    
    $(".restart").style.backgroundColor = "rgb(3, 123, 252)";
    $(".bet").style.display = "block";
  });
}

function restartGame()
{
  if(!stopped) return;
  if(money < bet) return alert("Change the bet!");
  
  $(".restart").style.backgroundColor = "grey";
  $(".bet").style.display = "none";


  stopped = false;
  ids = [ 'A', '2', '3', '4', '5',' 6', '7', '8', '9', '10', 'J', 'Q', 'K' ];
  available = [];
  for(const id of ids)
      available[id] = [...types];
  
  $(".cards-container").innerHTML = '';
  $(".cpu-cards-container").innerHTML = "CPU:";

  $(".verdict").style.transform = "scaleX(0)";
  cardCount = cpuCardCount = 0;

  $(".total").innerHTML = "Player Total: 0 <br> Cpu Total: ???";
}

function setupEvents()
{
    $(".take").addEventListener("click", takeCard);
    $(".stop").addEventListener("click", stopGame);
    $(".restart").addEventListener("click", restartGame);
    $$(".bet-change").forEach(changer => {
      changer.addEventListener("click", () => {
        bet = parseInt(changer.innerHTML);
        $(".bet-info").innerHTML = bet;
      });
    });
}