class Camera {
    constructor(video, button, canvas, ctx) {
        this.video = video
        this.button = button
        this.canvas = canvas
        this.ctx = ctx

        this.pictureSize = window.innerWidth * 0.6
        this.pictureX = (window.innerWidth - this.pictureSize) / 2
        this.pictureY = window.innerWidth * 0.2

        this.streaming = false
        this.button.onclick = () => {
            this.start()
            this.button.innerText = "Take photo"
        }
    }
    
    start() {
        // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } }, audio: false })
        .then( stream => {
            this.button.onclick = () => {
                this.stop()
                this.button.innerText = "Start Camera"
            }
            
            video.srcObject = stream
            video.onloadedmetadata = () => {
                video.play()
            }

            this.streaming = true
        })
        .catch( error => {
            alert("An error has occurred: " + error)
        })
    }

    stop() {
        if (this.streaming) {
            this.button.onclick = () => {
                this.start()
                this.button.innerText = "Take photo"
            }
    
            this.video.srcObject.getTracks().forEach((track) => {
                track.stop()
            })

            const imageData = this.ctx.getImageData(this.pictureX, this.pictureY, this.pictureSize, this.pictureSize)
            this.canvas.width = this.pictureSize
            this.canvas.height = this.pictureSize
            this.ctx.putImageData(imageData, 0, 0)
            
            this.streaming = false
        }
    }
}


function cameraCallback(camera) {
    if (!camera.streaming) {
        return
    }
    if (camera.video.videoWidth != 0) {
        camera.canvas.width = window.innerWidth
        camera.canvas.height = window.innerWidth * (camera.video.videoHeight / camera.video.videoWidth)
        camera.ctx.drawImage(camera.video, 0, 0, camera.canvas.width, camera.canvas.height)
        camera.ctx.strokeRect(camera.pictureX, camera.pictureY, camera.pictureSize, camera.pictureSize)
    }
    setTimeout(() => {
        cameraCallback(camera)
    }, 0)
}

export { Camera, cameraCallback }