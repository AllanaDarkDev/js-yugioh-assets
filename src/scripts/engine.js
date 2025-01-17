const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eye White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
    cardImage.setAttribute("data-id", IdCard)
    cardImage.classList.add("card")

    if (fieldSide === state.playerSides.player1) {

        cardImage.addEventListener("mouseover", () => {
            drawSelecCard(IdCard)
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }

    return cardImage
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    let dualResults = await checkDualResults(cardId, computerCardId)

    await updateScore()
    await drawButton(dualResults)
}

async function drawButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDualResults(playerCardId, computerCardId) {
    let dualResults = "DRAW"
    let playerCard = cardData[playerCardId]

    if (playerCard.WinOf.includes(computerCardId)) {
        dualResults = "WIN"
        await playAudio(dualResults)
        state.score.playerScore++
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        dualResults = "LOSE"
        await playAudio(dualResults)
        state.score.computerScore++
    }

    return dualResults
}


async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function drawSelecCard(index) {
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type
}

function init() {
    const bgm = document.getElementById("bgm")
    bgm.play()
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)

    
}

async function drawCards(quantity, user) {
    for(let i = 0; i < quantity; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, user)
        
        document.getElementById(user).appendChild(cardImage)
    }
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

async function resetDuel(){
    state.cardSprites.avatar.src = ""
    //state.cardSprites.name.innerText = "Select"
    //state.cardSprites.type.innerHTML = "a card"
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init()
}

init()