const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const addBallBtn = document.getElementById('addBallBtn');
const resetBtn = document.getElementById('resetBtn');

// Variables de puntuación
let score1 = 0;
let score2 = 0;

// Configuración de Raquetes
const paddleWidth = 12;
const paddleHeight = 80;
const paddleSpeed = 7;

const player1 = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
const player2 = { x: canvas.width - 22, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };

// Lista de Pelotas
let balls = [];

function createBall() {
const speedX = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 2);
const speedY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
return {
x: canvas.width / 2,
y: canvas.height / 2,
radius: 8,
dx: speedX,
dy: speedY,
color: ['#ff0055', '#00f0ff', '#ffe600', '#00ff66'][Math.floor(Math.random() * 4)]
};
}

// Inicializar primera pelota
balls.push(createBall());

// Controles Teclado
const keys = {};

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function movePaddles() {
// Jugador 1 (W / S)
if (keys['w'] || keys['W']) player1.dy = -paddleSpeed;
else if (keys['s'] || keys['S']) player1.dy = paddleSpeed;
else player1.dy = 0;

// Jugador 2 (Arriba / Abajo)
if (keys['ArrowUp']) player2.dy = -paddleSpeed;
else if (keys['ArrowDown']) player2.dy = paddleSpeed;
else player2.dy = 0;

// Mover y limitar en bordes
player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y + player1.dy));
player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y + player2.dy));
}

function updateBalls() {
for (let i = balls.length - 1; i >= 0; i--) {
let b = balls[i];

b.x += b.dx;
b.y += b.dy;

// Rebote superior e inferior
if (b.y - b.radius <= 0 || b.y + b.radius >= canvas.height) {
  b.dy *= -1;
}

// Colisión con Jugador 1
if (b.x - b.radius <= player1.x + paddleWidth &&
    b.y >= player1.y && b.y <= player1.y + paddleHeight) {
  b.dx = Math.abs(b.dx) * 1.05; // Aumenta velocidad un poco
  b.x = player1.x + paddleWidth + b.radius;
}

// Colisión con Jugador 2
if (b.x + b.radius >= player2.x &&
    b.y >= player2.y && b.y <= player2.y + paddleHeight) {
  b.dx = -Math.abs(b.dx) * 1.05;
  b.x = player2.x - b.radius;
}

// Anotar Punto Jugador 2 (se sale por la izquierda)
if (b.x < 0) {
  score2++;
  score2El.textContent = score2;
  checkAutoExtraBall();
  resetBallPosition(b);
}

// Anotar Punto Jugador 1 (se sale por la derecha)
if (b.x > canvas.width) {
  score1++;
  score1El.textContent = score1;
  checkAutoExtraBall();
  resetBallPosition(b);
}


}
}

function resetBallPosition(b) {
b.x = canvas.width / 2;
b.y = canvas.height / 2;
b.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
b.dy = (Math.random() > 0.5 ? 1 : -1) * 4;
}

// Genera pelota extra automática cada 3 puntos en total
function checkAutoExtraBall() {
if ((score1 + score2) % 3 === 0 && balls.length < 8) {
balls.push(createBall());
}
}

function draw() {
// Limpiar cancha
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Línea central
ctx.setLineDash([10, 10]);
ctx.beginPath();
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.strokeStyle = '#374151';
ctx.lineWidth = 2;
ctx.stroke();
ctx.setLineDash([]);

// Dibujar Jugador 1
ctx.fillStyle = '#ff0055';
ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);

// Dibujar Jugador 2
ctx.fillStyle = '#00f0ff';
ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

// Dibujar Pelotas
balls.forEach(b => {
ctx.beginPath();
ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
ctx.fillStyle = b.color;
ctx.fill();
ctx.closePath();
});
}

function gameLoop() {
movePaddles();
updateBalls();
draw();
requestAnimationFrame(gameLoop);
}

// Botones de acción
addBallBtn.addEventListener('click', () => {
if (balls.length < 10) balls.push(createBall());
});

resetBtn.addEventListener('click', () => {
score1 = 0;
score2 = 0;
score1El.textContent = 0;
score2El.textContent = 0;
balls = [createBall()];
});

// Arrancar Juego
gameLoop();
