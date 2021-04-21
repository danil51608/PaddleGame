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


//��������� �������� �������
let moveRight = false;
let moveLeft = false;

//����������� ������ � ������ �������� ����
canvas.width = 600; 
canvas.height = 700;

//������ ������
let ball = {
 x: canvas.width/2,
 y: canvas.height-50,
 radius: 7,
 dx: ballSpeed,
 dy: -ballSpeed,
 draw: function(){
  ctx.beginPath();
  ctx.fillStyle='black';
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);//��������� ������
  ctx.closePath();
  ctx.fill()
 }
}

//������ �������
let paddle = {
 width: paddleWidth,
 height: paddleHeight,
 x: canvas.width/2 - 50, //�������� ������ ���� ����� �������� ������ �������
 y: canvas.height - 10, // 15 - ����� ����� ����� � ��������
 draw: function(){
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.rect(this.x, this.y, this.width, this.height);//��������� �������
  ctx.closePath();
  ctx.fill();
 }
}

//��������� ��������� ������. ��� ��������.
function moveBall(){
 ball.x += ball.dx;
 ball.y += ball.dy;
}

//�������� ���������� ������� ������ ���� � ����� �����������
function ballBorders(){
 if(ball.x+ball.radius >= canvas.width || ball.x-ball.radius < 0) 	{ball.dx *= -1;}
 else if(ball.y-ball.radius < 0)
	{ball.dy *= -1;}
 else if(ball.y+ball.radius >= canvas.height)
	{ball.dy *= -1; resetBricks(); score=0;}
}

//��������� �� �������
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
   savedDx = ball.dx; //��������� �������� � ����������� �������� � ������ ������� �����
   savedDy = ball.dy;
   ball.dx = 0; //������������� �����
   ball.dy = 0;
  }
  else{ball.dx = savedDx; ball.dy =savedDy; savedDx = 0; savedDy=0}//��������������� �������� �������� �� ����� � �������� ����������� ��������
 }
});

//��������� �� ������ ������
document.addEventListener('keyup',(e)=>{
 if(e.key=='ArrowRight'){
  moveRight = false;
 }
 else if(e.key=='ArrowLeft'){
  moveLeft = false;
 }
});

//�������� �������
function movePaddle(){
 if(moveRight){ //���� ������ ������� ������
  paddle.x += paddleSpeed;
 }
 else if(moveLeft){ //���� ������ ������� �����
  paddle.x -= paddleSpeed;
 }
}

//�� ���� ����� ������� �� ������� ����
function paddleBorders(){
 if(paddle.x <0){
  paddle.x = 0;
 }
 else if(paddle.x+paddle.width >= canvas.width){
  paddle.x = canvas.width - paddle.width;
 }
}

//��������� ������������ ������� � ������ � ������ ����������� ������
function paddleHit(){
 if(
  ball.y+ball.radius >= paddle.y &&
  ball.x >= paddle.x &&
  ball.x <= paddle.x + paddle.width
 )
{ball.dy *= -1;}
}

//������� ������� ������ � ������� �� � ������
function generateBricks(){
 for(let r=0; r < rows; r++){
  bricks[r]=[];
  for(let c=0; c < cols; c++){
   bricks[r][c]={x:0, y:0, status: 1};
  }
 }
}

//���������� ������ � �������, ������ ������� ���������� � ������ ��
function drawBricks(){
 for(let r=0; r < rows; r++){
  for(let c=0; c < cols; c++){
   const brick = bricks[r][c];
   if(brick.status==1){
    ctx.beginPath();
   ctx.fillStyle = 'black';
   let brickX = c*(brickWidth+10)+ 30;//1� ����� ������ �/� �������, 2� �� ����� ������� ���� 
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

//��������� ����������� ������ � �����. ������� ���� ��� �����������
function brickHit(){
 for(let r=0; r < rows; r++){
  for(let c=0; c < cols; c++){
   let brick = bricks[r][c];
   if(ball.y-ball.radius <= brick.y+brickHeight && ball.x >= brick.x && ball.x <= brick.x+brickWidth && brick.status == 1){
     brick.status = 0; //������ ���� ������������
     ball.dy *= -1; //������ ����������� ������
     bricksDeleted++;//������� ��������� �����
     score++; //���������� score
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

function drawScore(){//������ score
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