// Récupérer l'élément du joueur dans le DOM
const player = document.getElementById("player");
// Taille de déplacement du joueur à chaque pas
const moveSize = 53.3;
// Variable pour suivre le mouvement du joueur
let playerWalk = 0;


//-------------------- CREATION DU TERRAIN DE JEU ----------------------


// Récupérer le conteneur du jeu dans le DOM
const gameContainer = document.getElementById("gameContainer");

// Définir la taille du terrain de jeu
const gridSize = 15; // Nombre de cellules en largeur et en hauteur
const cellSize = 800 / gridSize; // Taille en pixels d'une cellule

// Mettre à jour le style du conteneur de jeu avec les dimensions calculées
gameContainer.style.width = "800px";
gameContainer.style.height = "800px";

// Tableau représentant le terrain de jeu
const gameMap = [];

// Remplir le tableau gameMap avec des valeurs aléatoires
function generateRandomMap() {
  for (let row = 0; row < gridSize; row++) {
    gameMap.push([]);
    for (let col = 0; col < gridSize; col++) {
      // Générer une valeur aléatoire (0 ou 1) pour chaque cellule
      const cellValue = Math.random() < 0.5 ? 0 : 1;
      gameMap[row].push(cellValue);
    }
  }
  // Mettre la valeur de la première case à 0 pour éviter un mur
  gameMap[0][0] = 0;
  gameMap[0][1] = 0;
  gameMap[1][0] = 0;
}

// Appeler la fonction pour générer le terrain aléatoire
generateRandomMap();

// Fonction pour dessiner le terrain de jeu
function drawGameMap() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellValue = gameMap[row][col];
      const cellX = col * cellSize;
      const cellY = row * cellSize;

      if (cellValue === 1) {
        // Créer un élément div pour représenter un mur
        const wall = document.createElement("div");
        wall.classList.add("wall");
        // Définir les styles de l'élément pour représenter un mur
        wall.style.width = cellSize + "px";
        wall.style.height = cellSize + "px";
        wall.style.left = cellX + "px";
        wall.style.top = cellY + "px";
        // Ajouter l'élément au conteneur du jeu
        gameContainer.appendChild(wall);
      } else {
        // Créer un élément div pour représenter le sol
        const ground = document.createElement("div");
        ground.classList.add("ground");
        // Définir les styles de l'élément pour représenter le sol
        ground.style.width = cellSize + "px";
        ground.style.height = cellSize + "px";
        ground.style.left = cellX + "px";
        ground.style.top = cellY + "px";
        // Ajouter l'élément au conteneur du jeu
        gameContainer.appendChild(ground);
      }
    }
  }
}

// Appeler la fonction pour dessiner le terrain de jeu
drawGameMap();


// -----------------* DEPLACEMENTS JOUEUR ------------------------


// Écouter l'événement de pression d'une touche du clavier
document.addEventListener("keydown", function (event) {
  // Récupérer la position actuelle du joueur
  let newPositionX = player.offsetLeft;
  let newPositionY = player.offsetTop;

  // Vérifier quelle touche du clavier a été pressée
  if (event.code === "ArrowUp") {
    // Incrémenter le compteur de pas du joueur
    playerWalk = playerWalk + 1;
    // Alterner l'image du joueur pour simuler la marche
    if (playerWalk % 2 === 0) {
      player.style.backgroundImage = "url('imgs/5.png')";
    } else {
      player.style.backgroundImage = "url('imgs/6.png')";
    }
    // Mettre à jour la nouvelle position en fonction de la direction
    newPositionY -= moveSize;
  } else if (event.code === "ArrowRight") {
    playerWalk = playerWalk + 1;
    if (playerWalk % 2 === 0) {
      player.style.backgroundImage = "url('imgs/7.png')";
    } else {
      player.style.backgroundImage = "url('imgs/8.png')";
    }
    newPositionX += moveSize;
  } else if (event.code === "ArrowDown") {
    playerWalk = playerWalk + 1;
    if (playerWalk % 2 === 0) {
      player.style.backgroundImage = "url('imgs/1.png')";
    } else {
      player.style.backgroundImage = "url('imgs/2.png')";
    }
    newPositionY += moveSize;
  } else if (event.code === "ArrowLeft") {
    playerWalk = playerWalk + 1;
    if (playerWalk % 2 === 0) {
      player.style.backgroundImage = "url('imgs/3.png')";
    } else {
      player.style.backgroundImage = "url('imgs/4.png')";
    }
    newPositionX -= moveSize;
  }

  // Vérifier les limites horizontales
  if (
    newPositionX < 0 ||
    newPositionX + player.offsetWidth > gameContainer.offsetWidth
  ) {
    return; // Ne pas mettre à jour la position du joueur si c'est en dehors des limites
  }

  // Vérifier les limites verticales
  if (
    newPositionY < 0 ||
    newPositionY + player.offsetHeight > gameContainer.offsetHeight
  ) {
    return; // Ne pas mettre à jour la position du joueur si c'est en dehors des limites
  }

  // Vérifier si la nouvelle cellule contient un mur
  const newCellX = Math.floor(
    (newPositionX + player.offsetWidth / 2) / cellSize
  );
  const newCellY = Math.floor(
    (newPositionY + player.offsetHeight / 2) / cellSize
  );
  if (gameMap[newCellY][newCellX] === 1) {
    return; // Ne pas mettre à jour la position du joueur si c'est un mur
  }

  // Définir la nouvelle position du joueur
  player.style.left = newPositionX + "px";
  player.style.top = newPositionY + "px";
});

//-------------------------- CREATION DES MECHANTS--------------------------


let enemyList = []; // Liste pour stocker les ennemis

// Fonction pour générer une position aléatoire valide pour un ennemi
function generateRandomEnemyPosition() {
  let x, y; // Coordonnées x et y de la position générée

  do {
    x = Math.floor(Math.random() * gridSize); // Génère une coordonnée x aléatoire
    y = Math.floor(Math.random() * gridSize); // Génère une coordonnée y aléatoire
  } while (gameMap[y][x] !== 0); // Répète tant que la position n'est pas vide

  return { x, y }; // Retourne les coordonnées générées
}
for (let i = 0; i < 5; i++) {
  let enemy = document.createElement("div");
  let {x, y} = generateRandomEnemyPosition();
  enemy.style.left = x * cellSize + "px";
  enemy.style.top = y * cellSize + "px";
  enemy.classList.add("enemy");
  gameContainer.appendChild(enemy);
  
}





