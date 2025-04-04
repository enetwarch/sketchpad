window.addEventListener("load", () => makeGrid(16));

const eraserElement = document.getElementById("eraser");
const rainbowElement = document.getElementById("rainbow");
const settingsElement = document.getElementById("settings");
const outputElement = document.getElementById("output");

eraserElement.addEventListener("mousedown", resetGrid);
eraserElement.addEventListener("mouseup", toggleEraser);

rainbowElement.addEventListener("click", toggleRainbow);
settingsElement.addEventListener("click", changeGrid);

document.addEventListener("mouseup", () => isHeldDown = false);
document.addEventListener("contextmenu", event => event.preventDefault());

let isHeldDown = false;
let eraserIsToggled = false;
let rainbowIsToggled = false;

function makeGrid(gridSize) {
    outputElement.innerHTML = "";
    const repeatSize = `repeat(${gridSize}, 1fr)`;
    outputElement.style.gridTemplate = `${repeatSize} / ${repeatSize}`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement("div");

        div.addEventListener("mousedown", event => {
            isHeldDown = true;
            writeOnCell(event);
        });

        div.addEventListener("mouseover", event => {
            if (isHeldDown) writeOnCell(event);
        });

        outputElement.appendChild(div);
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

    eraserElement.classList.toggle("inverted");
}

function toggleRainbow() {
    if (eraserIsToggled) toggleEraser();
    
    rainbowIsToggled = !rainbowIsToggled;
    rainbowElement.classList.toggle("inverted");
}

function changeGrid() {
    settingsElement.classList.toggle("inverted");

    setTimeout(() => {
        let input = prompt("Change grid size (1 to 100).");
        if (!input) {
            settingsElement.classList.toggle("inverted");
            return;
        }

        input = parseInt(input);
        const inputIsNaN = isNaN(input);
        const inputIsWithinRange = input >= 1 && input <= 100;

        if (inputIsNaN || !inputIsWithinRange) {
            alert("Please input a number from 1 to 100.");
        } else {
            makeGrid(input);
        }

        settingsElement.classList.toggle("inverted");
    }, 250);
}

let eraserIsHeldDown = false;
let resetGridTimeout;

function resetGrid() {
    if (eraserIsHeldDown) return;
    eraserIsHeldDown = true;

    resetGridTimeout = setTimeout(() => {
        if (!eraserIsToggled) toggleEraser();

        setTimeout(resetCells, 250);
    }, 1000);
}

function resetCells() {
    if (confirm("Would you like to clear the sketchpad?")) {
        const cells = Array.from(outputElement.childNodes);

        cells.forEach(cell => {
            cell.style.backgroundColor = "#e6e6e6";
        });
    }

    toggleEraser();
}