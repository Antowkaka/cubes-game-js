//Get all default elements from game
const startBtn =document.querySelector('.start');
const newGameBtn =document.querySelector('.new-game');
const gameField =document.querySelector('.game-field');
const resultList = document.querySelector('.result-list');
const timer =document.querySelector('.time');
const score =document.querySelector('.points');
const popup =document.querySelector('.popup');
const popupBg =document.querySelector('.popup-bg');
const saveBtn =document.querySelector('.save');
const username =document.querySelector('.popup-username');
const popupScore =document.querySelector('.popup-result');
//Set start time
let allSeconds = 3;

//Catching our created cubes
let cubesArray = [];

//Create timer ID for stopping timer
let timerID;

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

//Popup controllers
const showPopup = () => {
    popupBg.className += ' bg-black opacity-90 right-0 bottom-0 w-screen h-screen z-10';
    popup.className += ' mx-auto w-4/12 h-40 inset-64 z-20 bg-gray-800 flex flex-col rounded-md';
};

const hidePopup = () => {
    popupBg.className = 'popup-bg fixed';
    popup.className = 'popup fixed';
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
    if (allSeconds > 30 && randType.type === 'time') return;
    const newCube = createCube('div', randX, randY, randType.color, randType.type);
    cubesArray.push(newCube);
    field.appendChild(newCube);
    addListener(newCube);
};

//StartButton switcher
const startBtnSwitcher = (name) => {
    if (name === 'Pause') {
        startBtn.innerHTML = 'Pause';
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
};

//End controller function
const endController = (type) => {
    switch (type.name) {
        case 'time': {
            popupScore.value = score.value;
            showPopup();
            startBtnSwitcher('Start');
            clearInterval(timerID);
        } break;
        case 'popup': {
            const timeKey = new Date(Date.now()).toLocaleString('ru-RU', {timeZone: 'Europe/Kiev'});
            localStorage.setItem(timeKey, JSON.stringify({
                name: username.value,
                result: popupScore.value
            }));
            hidePopup();
        } break;
    }
};

//Time controller func
const timeController = () => {
    return setInterval(() => {
        allSeconds--;
        let minutes = allSeconds >= 60 ? Math.floor(allSeconds / 60) : 0;
        let sec = allSeconds > 60 ? allSeconds - 60 * minutes : allSeconds;
        let tenInterval = minutes*allSeconds - sec;
        if (0 < tenInterval && tenInterval < 10) {
            sec = `0${sec}`;
        }
        timer.value =`0${minutes}:${sec}`;
        if (allSeconds === 0) {
            endController({name: 'time'});
        }
    }, 1000)
};

//Add start listener
document.addEventListener('DOMContentLoaded', () => {
    localStorage.length !== 0 && Object.keys(localStorage).forEach(key => {
        const userRow = document.createElement('li');
        const userFromStorage = JSON.parse(localStorage.getItem(key));
        userRow.innerHTML = `${userFromStorage.name} : ${userFromStorage.result}`;
        resultList.appendChild(userRow);
    })
}, {once: true});

//Add listeners for our cubes
const addListener = (cube) => {
    if (cube.dataset.type === 'double-point') {
        cube.addEventListener('dblclick', e => {
            score.value = Number(score.value) + 2;
            cube.remove();
            for(let i = 0; i < 3; i++) {
                cubeSpawner(gameField);
            }
        }, {once: true})
    } else {
        cube.addEventListener('click', (e) => {
            console.log('Cube: ', e.target.dataset.type);
            console.log('Hello');
            switch (e.target.dataset.type) {
                case 'point': {
                    score.value++;
                    cube.remove();
                    for(let i = 0; i < 3; i++) {
                        cubeSpawner(gameField);
                    }
                } break;
                case 'time': {
                    score.value++;
                    allSeconds += 5;
                    cube.remove();
                    for(let i = 0; i < 3; i++) {
                        cubeSpawner(gameField);
                    }
                } break;
            }
        }, {once: true})
    }
};

//Paused cubes
const pause = toggle => {
    if (toggle) {
        for (let child of gameField.children) {
            child.classList.toggle('opacity-50');
            child.disabled = true;
        }
    } else {
        for (let child of gameField.children) {
            child.classList.toggle('opacity-50');
            child.disabled = false;
        }
    }
};

//Listener for start button
startBtn.addEventListener('click', () => {
    if (startBtn.innerHTML !== 'Pause') {
        startBtnSwitcher('Pause');
        for(let i = 0; i < 5; i++) cubeSpawner(gameField);
        timerID = timeController();
    } else {
        startBtnSwitcher('Start');
        clearInterval(timerID);
    }
});

//Listener for save button
saveBtn.addEventListener('click', (event) => {
    endController({name: 'popup'});
});
