import npyjs from 'https://cdn.jsdelivr.net/npm/npyjs@0.4.0/+esm'

const n = new npyjs()

class ImageData {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.size = width*height
        this.loaded = false
    }

    async load(path) {
        await n.load(path, (array) => {
            this.data = array.data
            this.loaded = true
        })
    }

    getCanvasImageData(x) {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = this.width
        canvas.height = this.height
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < 3; j++) {
                imageData.data[i*4 + j] = this.data[x*this.size + i]
            }
            imageData.data[i*4 + 3] = 255
        }

        return imageData
    }
}


class LabelData {
    constructor() {
        this.loaded = false
    }
    
    async load(path) {
        const response = await fetch(path)
        const buffer = await response.arrayBuffer()
        this.data = new Uint8Array(buffer)
        this.loaded = true
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