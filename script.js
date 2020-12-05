const startBtn =document.querySelector('.start');
const newGameBtn =document.querySelector('.new-game');
const gameField =document.querySelector('.game-field');
const fieldCords = {x: gameField.offsetTop, y: gameField.offsetLeft};
const cubeColors = [
    "bg-blue",
    "bg-green",
    "bg-red"
];

const createCube = (tag = 'div', cordX = 0, cordY = 0, color = 'black') => {
    const cube = document.createElement(tag);
    cube.style.top = `${cordY}px`;
    cube.style.left = `${cordX}px`;
    cube.className = `${cordY}px ${cordX}px ${color}-500 hover:${color}-400 ${color}-500 cursor-pointer transition absolute duration-100 hover:shadow-lg w-6 h-6`;
    return cube;
};

Array.prototype.randArrItem = function(){
    return this[Math.floor(Math.random()*this.length)];
};

console.log("Field is here: ", gameField.offsetHeight);

const randInterval = {
    x: {
        min: 0,
        max: gameField.offsetWidth - 24
    },
    y: {
        min: 0,
        max: gameField.offsetHeight - 24
    }
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

const getFieldSize = () => [gameField.width, gameField.height];

const positionDetector = (children) => {
    return children.map((elem, i) => {
        const cordX = elem.offsetTop - fieldCords.x;
        const cordY = elem.offsetLeft - fieldCords.y;
        return {
            cube: i,
            cordX,
            cordY
        }
    });
};

const cubeSpawner = (field) => {
    let randX = getRandomInt(randInterval.x.min, randInterval.x.max);
    let randY = getRandomInt(randInterval.y.min, randInterval.y.max);
    let randColor = cubeColors.randArrItem();
    field.appendChild(createCube('div', randX, randY, randColor));
};

startBtn.addEventListener('click', () => {
   cubeSpawner(gameField);
   startBtn.innerHTML = 'Stop';
   startBtn.classList.toggle('bg-green-800');
   startBtn.classList.toggle('hover:bg-green-700');
   startBtn.classList.add('bg-red-800');
   startBtn.classList.add('hover:bg-red-700');
});


