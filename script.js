// Hook sur les éléments
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

// Données de base
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Récupère le high score du dépot local 
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Meilleur score : ${highScore}`;

// Donne une position X et Y entre 1 et 31 pour la nourriture
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Arrete le fonctionnement du jeu, affiche une alerte et relance une partie 
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over ! Press OK pour recommencer...");
    location.reload();
}

// Applique un changement de vélocité suivant la flèche détectée
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1; 
    }
    else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1; 
    }
    else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0; 
    }
    else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0; 
    }
}

// Change la direction suivant la touche appuyé
controls.forEach(button => button.addEventListener("click", () => changeDirection({key: button.dataset.key})));

const initGame = () => {
    // Si gameOver fin 
    if(gameOver) return handleGameOver();

    // Ajout de la nourriture en focntion des positions données
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Le snake mange la food 
    if(snakeX === foodX && snakeY === foodY){
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Ajouter la nourrite au tableau du corps du snake
        score++;
        highScore = score >= highScore ? score : highScore; // si score > highScore -> highScore = score

        // Stock le high score dans la key high-score du navigateur
        localStorage.setItem("high-score", highScore);

        // Affecte les score
        scoreElement.innerText = `Score : ${score}`;
        highScoreElement.innerText = `High Score : ${highScore}`;
    }
    
    // Acceleration de la vitesse
    snakeX += velocityX;
    snakeY += velocityY;


    // Deplace chaque partie du corps à l'emplacement d'avant 
    // Donne une impression d'avancement
    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];
    }

    // Emplacement de la tête
    snakeBody[0] = [snakeX, snakeY];

    // Regarde si la tête du snake n'est pas dans un mur
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        return gameOver = true;
    }

    // Ajoute une div pour chaque partie du corps du snake
    for(let i = 0; i < snakeBody.length; i++){

        // Ajout de la partie html du corps
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Test si la tete touche le corps -> mort
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    // Update de la zone de jeu
    playBoard.innerHTML = html;
}

// Update de l'apparition de la food
updateFoodPosition();

// Update tout les millisec de la fonction "initGame"
setIntervalId = setInterval(initGame, 100);

// Detecte les evenements sur les touches et appelle la fonction "changeDirection"
document.addEventListener("keyup", changeDirection);

