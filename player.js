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





