import npyjs from 'https://cdn.jsdelivr.net/npm/npyjs@0.4.0/+esm'

const n = new npyjs()

const WIDTH = 28
const HEIGHT = 28
const SIZE = WIDTH * HEIGHT

class ImageData {
    constructor() {
        this.loaded = false
    }

    async load() {
        await n.load("images.npy", (array) => {
            this.data = array.data
        })
        this.loaded = true
    }

    getCanvasImageData(x) {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = WIDTH
        canvas.height = HEIGHT
        const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT)
        
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < 3; j++) {
                imageData.data[i*4 + j] = this.data[x*SIZE + i]
            }
            imageData.data[i*4 + 3] = 255
        }

        return imageData
    }
}


class LabelData {
    constructor(inputElement) {
        this.inputElement = inputElement
        this.loaded = false

        this.inputElement.addEventListener("change", () => {
            const file = this.inputElement.files[0]
            file.arrayBuffer().then((array) => {
                this.loaded = true
                this.data = new Uint8Array(array)
                console.log(this.data)
            })
        })

    }

    download() {
        let a = document.createElement("a")
        let file = new Blob([this.data])
        a.href = URL.createObjectURL(file)
        a.download = "labels.bin"
        a.click()
    }

}


export { ImageData, LabelData }