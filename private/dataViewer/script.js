import { ImageData, LabelData, ModelData } from "./data.js"
import { getModel, train, showExamples, showAccuracy, showConfusion } from "./modelUtil.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const imageLabelElement = document.getElementById("imageLabelElement")
const imageIndexInput = document.getElementById("imageIndexInput")
const imageIndexElement = document.getElementById("imageIndexElement")
const downloadLabelsBtn = document.getElementById("downloadLabelsBtn")
const displayImagesBtn = document.getElementById("displayImagesBtn")
const labelCheckboxes = document.getElementById("labelCheckboxes")
const imagesContainer = document.getElementById("imagesContainer")
const trainBtn = document.getElementById("trainBtn")


const WIDTH = 28
const HEIGHT = 28
const SIZE = WIDTH * HEIGHT
const NUM_IMAGES = 81*124

imageIndexInput.max = NUM_IMAGES - 1

canvas.width = WIDTH
canvas.height = HEIGHT


const images = new ImageData(WIDTH, HEIGHT)
images.load("images.npy").then(() => {
    ctx.putImageData(images.getCanvasImageData(imageIndexInput.value), 0, 0)
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


const labels = new LabelData()
labels.load("./labels.bin").then(() => {
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
        
    for (let element of labelCheckboxes.children) {
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
    const convertedLabels = new Uint8Array(labels.data.length * 10)

    for (let i = 0; i < labels.data.length; i++) {
        convertedLabels[i * 10 + labels.data[i]] = 1
    }

    const data = new ModelData(images.data, convertedLabels);
    await showExamples(data);

    const model = getModel();
    
    await train(model, data);
    await showAccuracy(model, data);
    await showConfusion(model, data);
}
  

trainBtn.onclick = () => {
    run()
}