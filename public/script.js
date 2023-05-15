import { Model } from "./model.js"
import { getCanvasSection, resizeImageData, convertImageData } from "./dataUtil.js"
import { solveSudoku } from "./solver.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const predictBtn = document.getElementById("predictBtn")
const solveBtn = document.getElementById("solveBtn")


const IMAGE_WIDTH = 28
const IMAGE_HEIGHT = 28
const BATCH_SIZE = 81


canvas.width = IMAGE_WIDTH*16
canvas.height = IMAGE_HEIGHT*16


const sudokuElement = document.createElement("div")
sudokuElement.id = "sudokuElement"
for (let i = 0; i < 9; i++) {
    const newRow = document.createElement("div")
    newRow.classList.add("sudokuRow")
    for (let j = 0; j < 9; j++) {
        newRow.appendChild(document.createElement("p"))
    }
    sudokuElement.appendChild(newRow)
}
document.body.appendChild(sudokuElement)

const solvedElement = document.createElement("div")
solvedElement.style.backgroundColor = "green"
solvedElement.id = "solvedElement"
for (let i = 0; i < 9; i++) {
    const newRow = document.createElement("div")
    newRow.classList.add("sudokuRow")
    for (let j = 0; j < 9; j++) {
        newRow.appendChild(document.createElement("p"))
    }
    solvedElement.appendChild(newRow)
}
document.body.appendChild(solvedElement)


const image = new Image()
image.src = "./images/sudoku.jpg"
image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}


const numberRecognizer = new Model
numberRecognizer.load("./model/model.json")


predictBtn.onclick = () => {
    if (numberRecognizer.loaded) {
        const batchImagesArray = new Float32Array(BATCH_SIZE * IMAGE_WIDTH * IMAGE_HEIGHT)
    
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const imageArray = convertImageData(resizeImageData(getCanvasSection(canvas, x, y, 9, 9), IMAGE_WIDTH, IMAGE_HEIGHT))
                batchImagesArray.set(imageArray, (y*9 + x) * IMAGE_WIDTH * IMAGE_HEIGHT)
            }
        }
    
        const predictionData = tf.tensor2d(batchImagesArray, [BATCH_SIZE, IMAGE_WIDTH * IMAGE_HEIGHT]);

        for (const [index, value] of numberRecognizer.predict(predictionData, BATCH_SIZE).entries()) {
            sudokuElement.children[Math.floor(index / 9)].children[index%9].innerText = value
        }
    }
    else {
        alert("Model is still downloading")
    }
}


solveBtn.onclick = () => {
    const sudoku = []
    for (let y = 0; y < 9; y++) {
        sudoku.push([])
        for (let x = 0; x < 9; x++) {
            sudoku[sudoku.length - 1].push(parseInt(sudokuElement.children[y].children[x].innerText))
        }
    }

    const solved = solveSudoku(sudoku)

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            solvedElement.children[y].children[x].innerText = solved[y][x]
        }
    }
}
