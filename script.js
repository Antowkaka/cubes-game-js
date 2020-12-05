//Get all default elements from game
const startBtn =document.querySelector('.start');
const newGameBtn =document.querySelector('.new-game');
const gameField =document.querySelector('.game-field');

//Get game field coords
const fieldCords = {x: gameField.offsetTop, y: gameField.offsetLeft};

//Create cube types
const cubeTypes = [
    {type: 'point', color:"bg-blue"},
    {type: 'time', color:"bg-green"},
    {type: 'double-point', color:"bg-red"}
];

//Function for constructing cube node
const createCube = (tag = 'div', cordX = 0, cordY = 0, color = 'black', dataArttr = 'point') => {
    const cube = document.createElement(tag);
    cube.style.top = `${cordY}px`;
    cube.style.left = `${cordX}px`;
    cube.className = `${cordY}px ${cordX}px ${color}-500 hover:${color}-400 ${color}-500 cursor-pointer transition absolute duration-100 hover:shadow-lg w-6 h-6`;
    cube.dataset.type = dataArttr;
    return cube;
};

//Add function for getting rand item from array
Array.prototype.randArrItem = function(){
    return this[Math.floor(Math.random()*this.length)];
};

//Get intervals for rand func considering game field
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

//Func for getting random int between two numbers
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

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

//Func for spawning cube in game field
const cubeSpawner = (field) => {
    let randX = getRandomInt(randInterval.x.min, randInterval.x.max);
    let randY = getRandomInt(randInterval.y.min, randInterval.y.max);
    let randType = cubeTypes.randArrItem();
    field.appendChild(createCube('div', randX, randY, randType.color, randType.type));
};

//Listener for start button
startBtn.addEventListener('click', () => {
    if (startBtn.innerHTML !== 'Pause') {
        startBtn.innerHTML = 'Pause';
        cubeSpawner(gameField);
        startBtn.classList.toggle('bg-green-800');
        startBtn.classList.toggle('hover:bg-green-700');
        startBtn.classList.toggle('bg-yellow-800');
        startBtn.classList.toggle('hover:bg-yellow-700');
    } else {
        startBtn.innerHTML = 'Start';
        startBtn.classList.toggle('bg-green-800');
        startBtn.classList.toggle('hover:bg-green-700');
        startBtn.classList.toggle('bg-yellow-800');
        startBtn.classList.toggle('hover:bg-yellow-700');
    }
});

