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
                imageData.data[i*4 + j] = this.data[x*this.size + i] * 255
            }
            imageData.data[i*4 + 3] = 255
        }

        return imageData
    }
}


class LabelData {
    constructor() {
        this.loaded = false
        this.count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    
    async load(path) {
        const response = await fetch(path)
        const buffer = await response.arrayBuffer()
        this.data = new Uint8Array(buffer)
        
        for (const val of this.data) {
            this.count[val]++
        }
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


const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;


class ModelData {
	constructor(datasetImages, datasetLabels) {
        this.NUM_DATASET_ELEMENTS = datasetLabels.length / NUM_CLASSES
        this.NUM_TRAIN_ELEMENTS = Math.floor(this.NUM_DATASET_ELEMENTS * 0.9)
        this.NUM_TEST_ELEMENTS = this.NUM_DATASET_ELEMENTS - this.NUM_TRAIN_ELEMENTS
        
        this.datasetImages = datasetImages
        this.datasetLabels = datasetLabels
        
		this.shuffledTrainIndex = 0;
		this.shuffledTestIndex = 0;

        // Create shuffled indices into the train/test set for when we select a
        // random dataset element for training / validation.
        this.trainIndices = tf.util.createShuffledIndices(this.NUM_TRAIN_ELEMENTS);
        this.testIndices = tf.util.createShuffledIndices(this.NUM_TEST_ELEMENTS);
    
        // Slice the the images and labels into train and test sets.
        this.trainImages =
            this.datasetImages.slice(0, IMAGE_SIZE * this.NUM_TRAIN_ELEMENTS);
        this.testImages = this.datasetImages.slice(IMAGE_SIZE * this.NUM_TRAIN_ELEMENTS);
        this.trainLabels =
            this.datasetLabels.slice(0, NUM_CLASSES * this.NUM_TRAIN_ELEMENTS);
        this.testLabels =
            this.datasetLabels.slice(NUM_CLASSES * this.NUM_TRAIN_ELEMENTS);
	}


	nextTrainBatch(batchSize) {
		return this.nextBatch(
			batchSize, [this.trainImages, this.trainLabels], () => {
				this.shuffledTrainIndex = (this.shuffledTrainIndex + 1) % this.trainIndices.length;
				return this.trainIndices[this.shuffledTrainIndex];
		});
	}

	nextTestBatch(batchSize) {
		return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
			this.shuffledTestIndex = (this.shuffledTestIndex + 1) % this.testIndices.length;
			return this.testIndices[this.shuffledTestIndex];
		});
	}

	nextBatch(batchSize, data, index) {
		const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
		const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

		for (let i = 0; i < batchSize; i++) {
			const idx = index();

			const image = data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
			batchImagesArray.set(image, i * IMAGE_SIZE);

			const label = data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
			batchLabelsArray.set(label, i * NUM_CLASSES);
		}


		const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
		const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

		return {xs, labels};
	}
}


export { ImageData, LabelData, ModelData }