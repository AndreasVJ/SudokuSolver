import { ImageData, LabelData, ModelData } from "./data.js"
import { getModel, train, showExamples, showAccuracy, showConfusion } from "./modelUtil.js"
import { appendCheckboxes, appendRanges } from "./DOMUtil.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const imageLabelElement = document.getElementById("imageLabelElement")
const imageIndexInput = document.getElementById("imageIndexInput")
const imageIndexElement = document.getElementById("imageIndexElement")
const downloadLabelsBtn = document.getElementById("downloadLabelsBtn")
const displayImagesBtn = document.getElementById("displayImagesBtn")
const displayedNumbersForm = document.getElementById("displayedNumbersForm")
const imagesContainer = document.getElementById("imagesContainer")
const trainBtn = document.getElementById("trainBtn")
const downloadModelBtn = document.getElementById("downloadModelBtn")


const WIDTH = 28
const HEIGHT = 28
const SIZE = WIDTH * HEIGHT
const NUM_IMAGES = 81*124

imageIndexInput.max = NUM_IMAGES - 1

canvas.width = WIDTH
canvas.height = HEIGHT


const model = getModel()


const images = new ImageData(WIDTH, HEIGHT)
images.load("images.npy").then(() => {
    ctx.putImageData(images.getCanvasImageData(imageIndexInput.value), 0, 0)
})


const labels = new LabelData()
labels.load("./labels.bin").then(() => {
    imageLabelElement.innerText = labels.data[imageIndexInput.value]
    appendCheckboxes(displayedNumbersForm, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})


imageIndexInput.addEventListener("input", () => {
    imageIndexElement.innerText = imageIndexInput.value
    if (!images.loaded) {
        alert("Images are not done loading")
        return
    }
    if (!labels.loaded) {
        alert("Labels are not done loading")
        return
    }
    
    ctx.putImageData(images.getCanvasImageData(imageIndexInput.value), 0, 0)
    imageLabelElement.innerText = labels.data[imageIndexInput.value]
})


downloadLabelsBtn.onclick = () => {
    labels.download()
}


document.addEventListener("keydown", (event) => {
    if (!isNaN(event.key)) {
        if (labels.loaded) {
            labels.data[imageIndexInput.value] = event.key
            imageIndexInput.value++
            imageIndexInput.dispatchEvent(new Event("input", {bubbles:true}))
        }
        else {
            alert("Labels are not done loading")
        }
    }
})


displayImagesBtn.onclick = () => {
    const includedLabels = []
    
    for (let element of displayedNumbersForm.children) {
        if (element.type == "checkbox") {
            includedLabels.push(element.checked)
        }
    }

    imagesContainer.innerHTML = ""

    for (let i = 0; i < NUM_IMAGES; i++) {
        if (includedLabels[labels.data[i]]) {
            const newCanvas = document.createElement("canvas")
            const newCtx = newCanvas.getContext("2d")

            newCanvas.id = i
            
            newCanvas.width = WIDTH
            newCanvas.height = HEIGHT
    
            newCtx.putImageData(images.getCanvasImageData(i), 0, 0)
            
            imagesContainer.appendChild(newCanvas)
        }
    }
}


async function run() {

    let count = 0
    const a = []
    const b = []

    // Datasettet har en stor overvekt av tomme felt.
    // For unngå en model med bias blir bare hvert 13-ende tomme felt inkludert.
    for (let i = 0; i < labels.data.length; i++) {
        let include = true
        if (labels.data[i] == 0) {
            count++
            if (count%13 != 0) {
                include = false
            }
        }
        if (include) {
            for (let j = 0; j < SIZE; j++) {
                a.push(images.data[i * SIZE + j])
            }
            b.push(labels.data[i])
        }
    }

    const convertedImages = new Float32Array(a)

    const convertedLabels = new Uint8Array(b.length * 10)
    for (let i = 0; i < b.length; i++) {
        convertedLabels[i * 10 + b[i]] = 1
    }

    const data = new ModelData(convertedImages, convertedLabels)
    await showExamples(data)
    
    await train(model, data)
    await showAccuracy(model, data)
    await showConfusion(model, data)
}
  

trainBtn.onclick = () => {
    run()
}


downloadModelBtn.onclick = () => {
    model.save('downloads://model');
}