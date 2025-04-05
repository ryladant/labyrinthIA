const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const cellSize = 50;


let player = {
    x: 0,
    y: 0,
    width: cellSize,
    height: cellSize,
    color: 'blue',
}

const winPoint = {
    x:400,
    y: 400,
    width: cellSize,
    height: cellSize,
    color: 'green',
}

const epsilon = 0.1;
const alpha = 0.1;  
const gamma = 0.9;

document.addEventListener('keydown', (event) => {
    movePlayer(event.key);
}
);

const IA = true

let qTable = {};

let actions = [
    [0,-1], // up
    [0,1], // down
    [-1,0], // left
    [1,0] // right
]

for(let i = 0; i < canvas.width; i+=cellSize){
    for(let j = 0; j < canvas.height; j+=cellSize){
        const key = `${i},${j}`;
        qTable[key] = [0,0,0,0]
    }
}

function getState(x,y){
    return `${x},${y}`;
}

function chooseAction(state, epsilon=0.1){
    const key = getState(state.x, state.y);
    if (Math.random() < epsilon) {
        return Math.floor(Math.random() * actions.length);
    } else {
        const qValues = qTable[key];
        return qValues.indexOf(Math.max(...qValues));
    }
}

function mover(state, actionIndex){
    const action = actions[actionIndex];
    const newState = {
        x: Math.max(0, Math.min(canvas.width - cellSize, state.x + action[0] * cellSize)),
        y: Math.max(0, Math.min(canvas.height - cellSize, state.y + action[1] * cellSize))
    };
    return newState;
}

function trainIA(episodes=1000){
    for(let episode = 0; episode < episodes; episode++){
        let state = {x: 0, y: 0};
        let done = false;
        while(!done){
            const stateKey = getState(state.x, state.y);
            const actionIndex = chooseAction(state);
            const newState = mover(state, actionIndex);
            const newStateKey = getState(newState.x, newState.y);

            if(newState.x === winPoint.x && newState.y === winPoint.y){
                done = true;
                qTable[stateKey][actionIndex] += alpha * (1 - qTable[stateKey][actionIndex]);
            }else{
                qTable[stateKey][actionIndex] += alpha * (gamma * Math.max(...qTable[newStateKey]) - qTable[stateKey][actionIndex]);
            }
            state = newState;
        }
    }
}

trainIA(1000);
console.log("Q-Table:");
console.table(qTable);

function drawGrid() {
    for (let i = 0; i <= canvas.width; i += cellSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    for (let j = 0; j <= canvas.height; j += cellSize) {
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
    }
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawWinPoint() {
    ctx.fillStyle = winPoint.color;
    ctx.fillRect(winPoint.x, winPoint.y, winPoint.width, winPoint.height);
}

function movePlayer(key) {
    if(!IA){
        switch (key) {
            case 'w':
                if (player.y > 0) player.y -= cellSize;
                break;
            case 's':
                if (player.y < canvas.height - cellSize) player.y += cellSize;
                break;
            case 'a':
                if (player.x > 0) player.x -= cellSize;
                break;
            case 'd':
                if (player.x < canvas.width - cellSize) player.x += cellSize;
                break;
        }
        update();
    }else{
        while (steps < maxSteps) {
            const qValues = qTable[`${state[0]},${state[1]}`];
            const action = qValues.indexOf(Math.max(...qValues)); // melhor ação aprendida
            const nextState = mover(state, action);
            
            path.push(nextState);
            state = nextState;
            steps++;
          
            if (state[0] === goal[0] && state[1] === goal[1]) {
              console.log("🎯 Chegou no objetivo em", steps, "passos");
              break;
            }
          }
    }
}

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawWinPoint();
    drawPlayer();
}

function start(){
    update();
}

start()