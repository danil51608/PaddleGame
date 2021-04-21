const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreBlock = document.getElementById('score');
const highScoreBlock = document.getElementById('highscore');
const pauseBlock = document.getElementById('pause');
const ballSpeed = 7;
const paddleSpeed = 10;
const paddleWidth = 100;
const paddleHeight = 10;
const rows = 4;
const cols = 5;
const brickWidth = 100;
const brickHeight = 50;
let savedDx = 0;
let savedDy = 0;
let pause = false;
let bricksDeleted = 0;
let bricks = [];
let score = 0;


//состояния движения ракетки
let moveRight = false;
let moveLeft = false;

//определение ширины и высоты игрового поля
canvas.width = 600; 
canvas.height = 700;

//объект шарика
let ball = {
 x: canvas.width/2,
 y: canvas.height-50,
 radius: 7,
 dx: ballSpeed,
 dy: -ballSpeed,
 draw: function(){
  ctx.beginPath();
  ctx.fillStyle='black';
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);//рисование шарика
  ctx.closePath();
  ctx.fill()
 }
}

//объект ракетки
let paddle = {
 width: paddleWidth,
 height: paddleHeight,
 x: canvas.width/2 - 50, //половина ширины поля минус половина ширины ракетки
 y: canvas.height - 10, // 15 - зазор между полем и ракеткой
 draw: function(){
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.rect(this.x, this.y, this.width, this.height);//рисование ракетки
  ctx.closePath();
  ctx.fill();
 }
}

//изменение координат шарика. Его движение.
function moveBall(){
 ball.x += ball.dx;
 ball.y += ball.dy;
}

//проверка достижения шариком границ поля и смена направления
function ballBorders(){
 if(ball.x+ball.radius >= canvas.width || ball.x-ball.radius < 0) 	{ball.dx *= -1;}
 else if(ball.y-ball.radius < 0)
	{ball.dy *= -1;}
 else if(ball.y+ball.radius >= canvas.height)
	{ball.dy *= -1; resetBricks(); score=0;}
}

//слушатель на нажатия
document.addEventListener('keydown',(e)=>{
 if(e.key=='ArrowRight'){
  moveRight = true;
 }
 else if(e.key=='ArrowLeft'){
  moveLeft = true;
 }
 else if(e.keyCode==32){
  pauseBlock.classList.toggle('active');
  if(ball.dx!=0 && ball.dy!=0){
   savedDx = ball.dx; //сохраняет скорость и направление движения в момент нажатия паузы
   savedDy = ball.dy;
   ball.dx = 0; //останавливает шарик
   ball.dy = 0;
  }
  else{ball.dx = savedDx; ball.dy =savedDy; savedDx = 0; savedDy=0}//восстанавливает значения движения до паузы и обнуляет сохраненные значения
 }
});

//слушатель на отпуск кнопки
document.addEventListener('keyup',(e)=>{
 if(e.key=='ArrowRight'){
  moveRight = false;
 }
 else if(e.key=='ArrowLeft'){
  moveLeft = false;
 }
});

//движение ракетки
function movePaddle(){
 if(moveRight){ //если нажата клавиша вправо
  paddle.x += paddleSpeed;
 }
 else if(moveLeft){ //если нажата клавиша влево
  paddle.x -= paddleSpeed;
 }
}

//не дает выйти ракетке за пределы поля
function paddleBorders(){
 if(paddle.x <0){
  paddle.x = 0;
 }
 else if(paddle.x+paddle.width >= canvas.width){
  paddle.x = canvas.width - paddle.width;
 }
}

//проверяет столкновение ракетки и шарика и меняет направление шарика
function paddleHit(){
 if(
  ball.y+ball.radius >= paddle.y &&
  ball.x >= paddle.x &&
  ball.x <= paddle.x + paddle.width
 )
{ball.dy *= -1;}
}

//создает объекты блоков и заносит их в списки
function generateBricks(){
 for(let r=0; r < rows; r++){
  bricks[r]=[];
  for(let c=0; c < cols; c++){
   bricks[r][c]={x:0, y:0, status: 1};
  }
 }
}

//перебирает список с блоками, задает каждому координаты и рисует их
function drawBricks(){
 for(let r=0; r < rows; r++){
  for(let c=0; c < cols; c++){
   const brick = bricks[r][c];
   if(brick.status==1){
    ctx.beginPath();
   ctx.fillStyle = 'black';
   let brickX = c*(brickWidth+10)+ 30;//1е число отступ м/у блоками, 2е от левой границы поля 
   let brickY = r*(brickHeight+5)+20;
   brick.x = brickX;
   brick.y = brickY;
   ctx.rect(brickX, brickY, brickWidth, brickHeight);
   ctx.closePath();
   ctx.fill();
   }
  }
 }
}

//проверяет сталкивание шарика и блока. Удаляет блок при сталкивании
function brickHit(){
 for(let r=0; r < rows; r++){
  for(let c=0; c < cols; c++){
   let brick = bricks[r][c];
   if(ball.y-ball.radius <= brick.y+brickHeight && ball.x >= brick.x && ball.x <= brick.x+brickWidth && brick.status == 1){
     brick.status = 0; //делает блок неотражаемым
     ball.dy *= -1; //меняет направление шарика
     bricksDeleted++;//считает удаленные блоки
     score++; //прибавляет score
   }
  }
 }
}

function resetBricks(){
 for(let r=0; r < rows; r++){
  for(let c=0; c < cols; c++){
   bricks[r][c].status=1;
   bricksDeleted = 0;
  }
 }
}

function drawScore(){//рисует score
 scoreBlock.innerText = 'Score: '+score;
 if (highScoreBlock.innerText.replace('HighScore: ', '')<score){
    highScoreBlock.innerText = 'HighScore: ' + score;
 } 
}

function play(){
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 ball.draw();
 paddle.draw();
 moveBall();
 ballBorders();
 movePaddle();
 paddleBorders();
 paddleHit();
 drawBricks();
 brickHit();
 if(bricksDeleted==rows*cols){
  resetBricks();
  ball.dy *= -1;
  ball.y = canvas.height - 50;
 }
 drawScore();
 requestAnimationFrame(play);
}

generateBricks();
play();