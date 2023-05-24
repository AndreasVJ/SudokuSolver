function getCanvasSection(canvas, x, y, xMax, yMax) {
    return canvas.getContext("2d").getImageData(x*canvas.width/xMax, y*canvas.height/yMax, canvas.width/xMax, canvas.height/yMax)
}


function resizeImageData(imageData, width, height) {
    const temp1 = document.createElement("canvas")
    const t1ctx = temp1.getContext("2d")
    temp1.width = imageData.width
    temp1.height = imageData.height

    const temp2 = document.createElement("canvas")
    const t2ctx = temp2.getContext("2d")
    temp2.width = width
    temp2.height = height
    
    t1ctx.putImageData(imageData, 0, 0)
    t2ctx.drawImage(temp1, 0, 0, width, height)
    return t2ctx.getImageData(0, 0, temp2.width, temp2.height)
}


function convertImageData(imageData) {
    const IMAGE_WIDTH = 28
    const IMAGE_HEIGHT = 28

    const imageArray = new Float32Array(IMAGE_WIDTH * IMAGE_HEIGHT)
    
    for (let i = 0; i < IMAGE_WIDTH * IMAGE_HEIGHT; i++) {
        let sum = 0
        for (let j = 0; j < 3; j++) {
            sum += imageData.data[i*4 + j]
        }
        imageArray[i] = sum/(255*3)
    }
    
    return imageArray
}


function getImageDataFromImage(image, width, height) {
    // Create temporary canvas object
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height

    // Draw image on canvas and return pixel data
    ctx.drawImage(image, 0, 0, width, height)
    return ctx.getImageData(0, 0, width, height)
}


export { getCanvasSection, resizeImageData, convertImageData, getImageDataFromImage }