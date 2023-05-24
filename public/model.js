export class Model {
    constructor() {
        this.loaded = false
    }

    async load(url) {
        this.model = await tf.loadLayersModel(url)
        this.loaded = true
    }

    predict(data, batchSize = 1) {
        const IMAGE_WIDTH = 28
        const IMAGE_HEIGHT = 28
        const testxs = data.reshape([batchSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1])
        const prediction = this.model.predict(testxs).dataSync()
        testxs.dispose();
        return prediction
    }
}