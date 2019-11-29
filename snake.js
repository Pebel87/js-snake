//Setup canvas
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

document.addEventListener("keydown", changeDirection);

let dx = 10;
let dy = 0;
let isChangeingDirection = false;
let score = 0;
let gameTick = 600;

let beep = new Audio("beep.wav")

let eat = new Audio("eat.wav")

function changeDirection(event){

    if (isChangeingDirection) return;

    //alert(event.keyCode);
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    switch(event.keyCode){
        case LEFT_KEY:
            //dx = -10;
            isChangeingDirection = true;
            dx = (dx !== 10 ? -10 : dx);
            dy = 0;
            break;
        case RIGHT_KEY:
            //dx = 10;
            isChangeingDirection = true;
            dx = (dx !== -10 ? 10 : dx);
            dy = 0;
            break;
        case UP_KEY:
            dx = 0;
            //dy = 10;
            isChangeingDirection = true;
            dy = (dy !== 10 ? -10 : dy);
            break;
        case DOWN_KEY:
            dx = 0;
            //dy = -10;
            isChangeingDirection = true;
            dy = (dy !== -10 ? 10 : dy);
            break;
        default:
            dx = dx;
            dy = dy;
            break;
    }
}

//Make the snake
let snake = [
    {
        x: 150,
        y: 150
    },
    {
        x: 140,
        y: 150
    },
    {
        x: 130,
        y: 150
    },
    {
        x: 120,
        y: 150
    },
    {
        x: 110,
        y: 150
    }
]

//Make the food
let food = [
    {
        x: null,
        y: null
    }
]

//function drawSnake(){
//    snake.forEach(function(part){
//        ctx.fillStyle = "lightgreen";
//        ctx.strokeStyle = "darkgreen";
//        ctx.fillRect(part.x, part.y, 10, 10);
//        ctx.strokeRect(part.x, part.y, 10, 10);
//    })
//}

function drawSnake(){
    for(let i = 0; i < snake.length; i++){
        if(i == 0){
            ctx.fillStyle = "orange";
            ctx.strokeStyle = "darkgreen";
        } else if(i % 3 == 2){
            ctx.fillStyle = "lightgreen";
            ctx.strokeStyle = "darkgreen";
        } else if(i % 3 == 1) {
            ctx.fillStyle = "lightblue";
            ctx.strokeStyle = "darkgreen";
        } else if(i % 3 == 0) {
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "darkgreen";
        }
        
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
        ctx.strokeRect(snake[i].x, snake[i].y, 10, 10);
    }
}


function drawFood(){
    if(food[0].x != null && food[0].y != null){
        ctx.fillStyle = "red";
        ctx.strokeStyle = "darkred";
        ctx.fillRect(food[0].x, food[0].y, 10, 10);
        ctx.strokeRect(food[0].x, food[0].y, 10, 10);
    }
}

function generateFood(){
    if(food[0].x == null && food[0].y == null){
        let minx = 0;
        let maxx = gameCanvas.width - 10;
        let miny = 0;
        let maxy = gameCanvas.height - 10;
        food[0].x = Math.round((Math.random() * (maxx - minx) + minx) / 10) * 10;
        food[0].y = Math.round((Math.random() * (maxy - miny) + miny) / 10) * 10;
    }
    snake.forEach(function(part){
       if(food[0].x == part.x && food[0].y == part.y){
           food[0].x = null;
           food[0].y = null;
           generateFood();
        }
    });
}

function moveSnake(){
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    }
    snake.unshift(head);
    if (!snakeEaten()){
        snake.pop();
    }
    beep.play();
}

function snakeEaten(){
    if(snake[0].x == food[0].x && snake[0].y == food[0].y){
        food[0].x = null;
        food[0].y = null;
        gameTick = gameTick -10;
        score = score +10;
        eat.play();
        return true;
    }
    return false;
}

function checkOutOfBounds(){
    if(snake[0].x >= gameCanvas.width){
        snake[0].x = 0;
    }
    if(snake[0].x < 0){
        snake[0].x = gameCanvas.width -10;
    }
    if(snake[0].y >= gameCanvas.height){
        snake[0].y = 0;
    }
    if(snake[0].y < 0){
        snake[0].y = gameCanvas.height -10;
    }
}

function checkCollision(){
    for(let i = 3; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            return true;
        }
    }
    return false;
}

function updateScore(){
    document.getElementById("score").innerText = "Score: " + score;
}

function main(){
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    moveSnake();
    isChangeingDirection = false;

    checkOutOfBounds();
    generateFood();
    drawFood();
    drawSnake();
    if (checkCollision()) {
        alert("Game Over\nYour score: " + score);
        location.reload();
    }
    gameTick = Math.max(100, gameTick);
   
    updateScore();
    setTimeout(function(){
        main();
    }, gameTick);
};

main();