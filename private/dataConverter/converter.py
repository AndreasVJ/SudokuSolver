import numpy as np
import os
from PIL import Image
from pathlib import Path


WIDTH = 28
HEIGHT = 28
X_SECTIONS = 9
Y_SECTIONS = 9
SIZE = WIDTH * HEIGHT
BOARD_SIZE = SIZE * X_SECTIONS * Y_SECTIONS


def getImageSection(img: Image.Image, x, y, x_sections, y_sections):
    width, height = img.size
    section_width = width / x_sections 
    section_height = height / y_sections
    return img.crop((x*section_width, y*section_height, x*section_width + section_width, y*section_width + section_height))


directory = Path(__file__).parent / "./cropped images"
files = os.listdir(directory)

converted_data = np.array([-1] * BOARD_SIZE * len(files), dtype=np.float32)

print(len(converted_data))

for i, file in enumerate(files):
    print(f'{i+1} / {len(files)}')

    # Load sudoku image and make it square
    sudoku_img = Image.open(directory / file)
    sudoku_img = sudoku_img.resize((sudoku_img.size[0], sudoku_img.size[0]))

    # Loop through all positions in the sudoku
    for y in range(Y_SECTIONS):
        for x in range(X_SECTIONS):
            img = getImageSection(sudoku_img, x, y, X_SECTIONS, Y_SECTIONS)
            img = img.resize((WIDTH, HEIGHT))
            
            pixel_data = img.load()

            for py in range(HEIGHT):
                for px in range(WIDTH):
                    converted_data[i * BOARD_SIZE + (y * X_SECTIONS + x) * SIZE + py*WIDTH + px] = np.mean(pixel_data[px, py])


np.save(Path(__file__).parent.parent / "dataViewer/data", converted_data)