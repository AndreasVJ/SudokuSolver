import npyjs from 'https://cdn.jsdelivr.net/npm/npyjs@0.4.0/+esm'

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const WIDTH = 28
const HEIGHT = 28
const SIZE = WIDTH * HEIGHT

canvas.width = WIDTH
canvas.height = HEIGHT

ctx.fillStyle = "green"
ctx.fillRect(0, 0, canvas.width, canvas.height)

let n = new npyjs()

n.load("data.npy", (array) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < SIZE; i++) {
        imageData.data[i*4] = array.data[i + SIZE*705]
        imageData.data[i*4 + 1] = array.data[i + SIZE*705]
        imageData.data[i*4 + 2] = array.data[i + SIZE*705]
    }
    ctx.putImageData(imageData, 0, 0)
})

console.log(n)