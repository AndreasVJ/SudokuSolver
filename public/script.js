import { Model } from "./model.js"
import { Camera, cameraCallback } from "./camera.js"
import { createSudokuElement } from "./DOMUtil.js"
import { getCanvasSection, resizeImageData, convertImageData } from "./util.js"
import { solveSudoku } from "./solver.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const video = document.getElementById("video")
const cameraBtn = document.getElementById("cameraBtn")
const sudokuElement = createSudokuElement()
const predictBtn = document.getElementById("predictBtn")
const solveBtn = document.getElementById("solveBtn")


const camera = new Camera(video, cameraBtn, canvas, ctx)
video.addEventListener("play", () => {
    cameraCallback(camera)
})


const numberRecognizer = new Model
numberRecognizer.load("./model/model.json")


predictBtn.onclick = () => {
    if (numberRecognizer.loaded) {
        const IMAGE_WIDTH = 28
        const IMAGE_HEIGHT = 28
        const BATCH_SIZE = 81

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
            sudokuElement.children[y].children[x].innerText = solved[y][x]
        }
    }
}
