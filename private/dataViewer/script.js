import { ImageData, LabelData } from "./data.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const imageIndexInput = document.getElementById("imageIndexInput")
const imageIndexElement = document.getElementById("imageIndexElement")
const downloadLabelsBtn = document.getElementById("downloadLabelsBtn")

const WIDTH = 28
const HEIGHT = 28
const SIZE = WIDTH * HEIGHT
const NUM_IMAGES = 81*124

imageIndexInput.max = NUM_IMAGES - 1

const arr = new Uint8Array(NUM_IMAGES, -1)
for (let i = 0; i < NUM_IMAGES; i++) {
    arr[i] = -1
}


function download(content, fileName, contentType) {
    var a = document.createElement("a")
    var file = new Blob([content], {type: contentType})
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
}

// download(arr, 'labels.bin', "");


canvas.width = WIDTH
canvas.height = HEIGHT

const images = new ImageData(WIDTH, HEIGHT)
images.load("images.npy").then(() => {
    ctx.putImageData(images.getCanvasImageData(imageIndexInput.value), 0, 0)
})

const labels = new LabelData()
labels.load("./labels.bin")

downloadLabelsBtn.onclick = () => {
    labels.download()
}




imageIndexInput.addEventListener("input", () => {
    if (images.loaded) {
        ctx.putImageData(images.getCanvasImageData(imageIndexInput.value), 0, 0)
    }
    else {
        alert("Images are not done loading")
    }
    imageIndexElement.innerText = imageIndexInput.value
})


document.addEventListener("keydown", (event) => {
    if (!isNaN(event.key)) {
        if (labels.loaded) {
            labels.data[imageIndexInput.value] = event.key
            imageIndexInput.value++
            ctx.putImageData(images.getCanvasImageData(imageIndexInput.value), 0, 0)
            console.log(labels.data)
        }
        else {
            alert("Labels are not done loading")
        }
    }
})