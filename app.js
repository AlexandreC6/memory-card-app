const cards = document.querySelectorAll(".card");

function shuffleCards(){
  cards.forEach(card => {
    const randomPos = Math.trunc(Math.random() * 12);
    card.style.order = randomPos;
  })
}
shuffleCards()

cards.forEach(card => card.addEventListener("click", flipCard));

let lockedCards = false;
let cardsPicked = [];
function flipCard(event) {
  if (lockedCards) return;
  // console.log(event.target.children[0], event.target.getAttribute("data-attr")); //double-face

  saveCard(event.target.children[0], event.target.getAttribute("data-attr"));

  if (cardsPicked.length === 2) result();
}

function saveCard(element, value) {
  // optional chaining -> pas d'erreur si = null ou undefined
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  if(element === cardsPicked[0]?.element) return;

  element.classList.add("active");
  cardsPicked.push({element, value});
  console.log(cardsPicked);
}

function result() {
  saveNumberOfTries()

  console.log(cardsPicked);
  if(cardsPicked[0].value === cardsPicked[1].value) {
    cardsPicked[0].element.parentElement.removeEventListener("click", flipCard)
    cardsPicked[1].element.parentElement.removeEventListener("click", flipCard)
    cardsPicked = [];
    return;
  }

  lockedCards = true;
  setTimeout(() => {
    cardsPicked[0].element.classList.remove("active");
    cardsPicked[1].element.classList.remove("active");
    cardsPicked = [];
    lockedCards = false;
  }, 1000);

  return;
}

const innerCards = [...document.querySelectorAll(".double-face")];
const advice = document.querySelector(".advice");
const counterScore = document.querySelector(".score")

let numberOfTries = 0
function saveNumberOfTries() {
  numberOfTries ++;
  // Met dans le tableau, ceux qui n'ont pas la classe active
  const checkIfFinish = innerCards.filter(card => !card.classList.contains("active"));
  if(!checkIfFinish.length){
    advice.textContent = "Bravo ! Press 'r' pour recommencer !"
    counterScore.textContent = `Votre score final est de ${numberOfTries}.`
    return;
  }
  counterScore.textContent = `Nombre de coups : ${numberOfTries}`
}

window.addEventListener("keydown", handleRestart);

let shuffleLock = false;
function handleRestart(e) {
  e.preventDefault()
  // KeyCode -> 82 = r
  if(e.keyCode === 82){
    innerCards.forEach(card => card.classList.remove("active"))
    advice.textContent = "Tentez de gagner avec le moins d'essais possible."
    counterScore.textContent = `Nombre de coups : 0`
    numberOfTries = 0;
    cards.forEach(card => card.addEventListener("click", flipCard));

    if(shuffleLock) return;
    shuffleLock = true;
    setTimeout(() => {
      shuffleCards();
      shuffleLock = false;
    }, 600);
  }
}
