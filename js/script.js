window.addEventListener("mouseup", () => isHeldDown = false);
window.addEventListener("load", () => {
    addListeners();
    makeGrid(16);
});

const listenerConfig = [
    [() => toggleEraser(), [["mouseup", "eraser"], ["keyup", "Digit1"]]],
    [() => toggleRainbow(), [["click", "rainbow"], ["keyup", "Digit2"]]],
    [() => changeGrid(), [["click", "settings"], ["keyup", "Digit3"]]],
    [() => resetGrid(), [["mousedown", "eraser"]]]
];

function addListeners() {
    listenerConfig.forEach(config => {
        const func = config[0];
        const listeners = config[1];
        listeners.forEach(listener => {
            addListener(listener, func);
        });
    }); 
}

function addListener(listener, func) {
    const eventType = listener[0];
    if (eventType !== "keyup") {
        const id = listener[1];
        const element = document.getElementById(id);
        element.addEventListener(eventType, func);
    } else {
        const eventCode = listener[1];
        document.addEventListener(eventType, event => {
            if (event.code === eventCode) func();
        });
    }
}

const output = document.getElementById("output");
const eraser = document.getElementById("eraser");
const rainbow = document.getElementById("rainbow");
let isHeldDown = false;
let eraserIsToggled = false;
let rainbowIsToggled = false;

function makeGrid(gridSize) {
    output.innerHTML = "";
    const repeatSize = `repeat(${gridSize}, 1fr)`;
    output.style.gridTemplate = `${repeatSize} / ${repeatSize}`;
    for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement("div");
        div.addEventListener("mousedown", event => {
            isHeldDown = true;
            writeOnCell(event);
        });
        div.addEventListener("mouseover", event => {
            if (isHeldDown) writeOnCell(event);
        });
        output.appendChild(div);
    }
}

function writeOnCell(event) {
    const target = event.target;
    if (eraserIsToggled) {
        target.style.backgroundColor = "#e6e6e6";
    } else if (rainbowIsToggled) {
        const possibleSymbols = "0123456789ABCDEF";
        let randomColor = "#";
        for (let i = 0; i < 6; i++) {
            const randomSymbol = Math.floor(Math.random() * 16);
            randomColor += possibleSymbols[randomSymbol];
        }
        target.style.backgroundColor = randomColor;
    } else {
        target.style.backgroundColor = "black";
    }
}

function toggleEraser() {
    eraserIsHeldDown = false;
    clearTimeout(resetGridTimeout);
    if (rainbowIsToggled) toggleRainbow();
    eraserIsToggled = !eraserIsToggled;
    eraser.classList.toggle("invert");
}

function toggleRainbow() {
    if (eraserIsToggled) toggleEraser();
    rainbowIsToggled = !rainbowIsToggled;
    rainbow.classList.toggle("invert");
}

function changeGrid() {
    while (true) {
        let input = prompt("Change grid size (1 to 100).");
        if (input === null) break;
        input = parseInt(input);
        const inputIsNaN = isNaN(input);
        const inputIsWithinRange = input >= 1 && input <= 100;
        if (inputIsNaN || !inputIsWithinRange) {
            alert("Please input a number from 1 to 100.");
        } else {
            makeGrid(input);
            break;
        }
    }
}

let eraserIsHeldDown = false;
let resetGridTimeout;

function resetGrid() {
    if (eraserIsHeldDown) return;
    eraserIsHeldDown = true;
    resetGridTimeout = setTimeout(() => {
        if (!confirm("Would you like to clear the sketchpad?")) {
            return;
        }
        const cells = Array.from(output.childNodes);
        cells.forEach(cell => {
            cell.style.backgroundColor = "#e6e6e6";
        });
    }, 1000);
}