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

const indestructibleWalls = [
  { row: 1, col: 1 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 7 }, { row: 1, col: 9 }, { row: 1, col: 11 }, { row: 1, col: 13 },
  { row: 3, col: 1 }, { row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 7 }, { row: 3, col: 9 }, { row: 3, col: 11 }, { row: 3, col: 13 },
  { row: 5, col: 1 }, { row: 5, col: 3 }, { row: 5, col: 5 }, { row: 5, col: 7 }, { row: 5, col: 9 }, { row: 5, col: 11 }, { row: 5, col: 13 },
  { row: 7, col: 1 }, { row: 7, col: 3 }, { row: 7, col: 5 }, { row: 7, col: 7 }, { row: 7, col: 9 }, { row: 7, col: 11 }, { row: 7, col: 13 },
  { row: 9, col: 1 }, { row: 9, col: 3 }, { row: 9, col: 5 }, { row: 9, col: 7 }, { row: 9, col: 9 }, { row: 9, col: 11 }, { row: 9, col: 13 },
  { row: 11, col: 1 }, { row: 11, col: 3 }, { row: 11, col: 5 }, { row: 11, col: 7 }, { row: 11, col: 9 }, { row: 11, col: 11 }, { row: 11, col: 13 },
  { row: 13, col: 1 }, { row: 13, col: 3 }, { row: 13, col: 5 }, { row: 13, col: 7 }, { row: 13, col: 9 }, { row: 13, col: 11 }, { row: 13, col: 13 }
  // Ajoutez autant de coordonnées de murs indestructibles que nécessaire
];



function generateRandomMap() {
  for (let row = 0; row < gridSize; row++) {
    gameMap.push([]);
    for (let col = 0; col < gridSize; col++) {
      let cellValue = 1; // Par défaut, toutes les cellules sont des murs destructibles

      // Vérifiez si les coordonnées correspondent à un mur indestructible
      const isIndestructible = indestructibleWalls.some(
        (wall) => wall.row === row && wall.col === col
      );

      if (!isIndestructible) {
        // Générer une valeur aléatoire (0 ou 1) pour chaque cellule
        cellValue = Math.random() < 0.6 ? 0 : 1;
      }

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
        // Vérifiez si les coordonnées correspondent à un mur indestructible
        const isIndestructible = indestructibleWalls.some(
          (wall) => wall.row === row && wall.col === col
        );

        // Créer un élément div pour représenter un mur
        const wall = document.createElement("div");
        wall.classList.add(isIndestructible ? "indestructible-wall" : "wall");

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

    // Vérifier si la touche est la barre d'espace pour placer une bombe
    if (event.code === "Space") {
      placeBomb();
    }

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
  let x, y;

  do {
    x = Math.floor(Math.random() * gridSize);
    y = Math.floor(Math.random() * gridSize);
  } while (gameMap[y][x] !== 0 || (x === 0 && y === 0) || (x === 0 && y === 1) || (x === 0 && y === 2) || (x === 0 && y === 3) || (x === 0 && y === 4) || (x === 1 && y === 0) || (x === 1 && y === 1) || (x === 1 && y === 2) || (x === 1 && y === 3) || (x === 1 && y === 4) || (x === 2 && y === 0) || (x === 2 && y === 1) || (x === 2 && y === 2) || (x === 2 && y === 3)|| (x === 2 && y === 4) || (x === 3 && y === 0) || (x === 3 && y === 1) || (x === 3 && y === 2) || (x === 3 && y === 3) || (x === 3 && y === 4) || (x === 4 && y === 0) || (x === 4 && y === 1) || (x === 4 && y === 2) || (x === 4 && y === 3) || (x === 4 && y === 4)); // Exclut les positions 

  return { x, y };
}


// Création des ennemis
for (let i = 0; i < 5; i++) {
  let enemy = document.createElement("div");
  enemy.id = "enemy" + String(i);

  let { x, y } = generateRandomEnemyPosition();

  gameMap[y][x] = 1;
  enemy.enemyX = x;
  enemy.enemyY = y;
  enemy.classList.add("enemy");
  enemy.style.left = String(x * cellSize) + "px";
  enemy.style.top = String(y * cellSize) + "px";
  gameContainer.appendChild(enemy);

  enemyList.push(enemy);
}
function isEnemyAtPosition(x, y) {
  for (let i = 0; i < enemyList.length; i++) {
    const enemy = enemyList[i];
    if (enemy.enemyX === x && enemy.enemyY === y) {
      return true;
    }
  }
  return false;
}

function isWallAtPosition(x, y) {
  return gameMap[y][x] === 1;
}

function isPositionValid(x, y) {
  return (
    x >= 0 &&
    x < gridSize &&
    y >= 0 &&
    y < gridSize &&
    !isWallAtPosition(x, y) &&
    !isEnemyAtPosition(x, y)
  );
}

function moveEnemy(enemy) {
  const enemyX = enemy.enemyX;
  const enemyY = enemy.enemyY;

  let direction;

  let random = random100();

  if (random < 25) {
    direction = "left";
  } else if (random >= 25 && random < 50) {
    direction = "right";
  } else if (random >= 50 && random < 75) {
    direction = "up";
  } else {
    direction = "down";
  }

  let newEnemyX = enemyX;
  let newEnemyY = enemyY;

  if (direction === "left") {
    newEnemyX = enemyX - 1;
  } else if (direction === "right") {
    newEnemyX = enemyX + 1;
  } else if (direction === "up") {
    newEnemyY = enemyY - 1;
  } else if (direction === "down") {
    newEnemyY = enemyY + 1;
  }

  // Vérifier si la nouvelle position est valide et libre
  if (isPositionValid(newEnemyX, newEnemyY)) {
    // Mettre à jour les coordonnées de l'ennemi dans le tableau gameMap
    gameMap[enemyY][enemyX] = 0;
    gameMap[newEnemyY][newEnemyX] = 1;

    // Mettre à jour les coordonnées de l'ennemi dans l'objet enemy
    enemy.enemyX = newEnemyX;
    enemy.enemyY = newEnemyY;

    // Mettre à jour la position de l'ennemi sur l'écran
    enemy.style.left = String(newEnemyX * cellSize) + "px";
    enemy.style.top = String(newEnemyY * cellSize) + "px";
  }
}

function random100() {
  return Math.floor(Math.random() * 100);
}

function moveAllEnemies() {
  for (let i = 0; i < enemyList.length; i++) {
    moveEnemy(enemyList[i]);
    checkCollision(player, enemyList[i]);
  }

  // Appeler moveAllEnemies à nouveau après un délai de 500 millisecondes
  setTimeout(moveAllEnemies, 500);
}
function checkCollision(player, enemy) {
  const playerRect = player.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();

  if (
    playerRect.x < enemyRect.x + enemyRect.width &&
    playerRect.x + playerRect.width > enemyRect.x &&
    playerRect.y < enemyRect.y + enemyRect.height &&
    playerRect.y + playerRect.height > enemyRect.y
  ) {
    // Collision détectée, le joueur est touché par un ennemi

    // Mettez ici la logique pour la défaite du joueur, par exemple :
    alert("Vous avez perdu !");
    
    // Réinitialiser la position du joueur
    player.style.left = "3.3%";
    player.style.top = "3.3%";
  }
}

// Appeler moveAllEnemies pour démarrer le mouvement continu des ennemis
moveAllEnemies();


// --------------------- CREATION BOMBE -----------------------

let bomb = null;

function placeBomb() {
  if (bomb !== null) {
    return; // Il y a déjà une bombe sur le terrain
  }

  const playerX = Math.floor(player.offsetLeft / cellSize);
  const playerY = Math.floor(player.offsetTop / cellSize);

  if (isEnemyAtPosition(playerX, playerY)) {
    return; // Le joueur ne peut pas placer une bombe sur un ennemi
  }

  // Créer un élément div pour représenter la bombe
  bomb = document.createElement("div");
  bomb.classList.add("bomb");

  // Définir les styles de l'élément pour représenter la bombe
  bomb.style.width = cellSize + "px";
  bomb.style.height = cellSize + "px";
  bomb.style.left = playerX * cellSize + "px";
  bomb.style.top = playerY * cellSize + "px";

  // Ajouter l'élément au conteneur du jeu
  gameContainer.appendChild(bomb);

  // Lancer la minuterie de l'explosion de la bombe après 2 secondes
  setTimeout(explodeBomb, 2000);
}
function explodeBomb() {
  const bombX = Math.floor(bomb.offsetLeft / cellSize);
  const bombY = Math.floor(bomb.offsetTop / cellSize);

  // Supprimer la bombe du DOM
  bomb.remove();
  bomb = null;

  // Supprimer les ennemis à proximité de l'explosion
  for (let i = 0; i < enemyList.length; i++) {
    const enemy = enemyList[i];
    const enemyX = enemy.enemyX;
    const enemyY = enemy.enemyY;

    if (
      Math.abs(enemyX - bombX) <= 1 &&
      Math.abs(enemyY - bombY) <= 1
    ) {
      // Supprimer l'ennemi du DOM
      enemy.remove();

      // Retirer l'ennemi de la liste enemyList
      enemyList.splice(i, 1);

      // Mettre à jour le tableau gameMap pour supprimer l'ennemi
      gameMap[enemyY][enemyX] = 0;

      // Décrémenter l'index pour compenser la suppression de l'ennemi
      i--;
    }
  }
}






