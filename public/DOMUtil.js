function createSudokuElement() {
    const sudokuElement = document.getElementById("sudokuElement")
    for (let i = 0; i < 9; i++) {
        const newRow = document.createElement("div")
        newRow.classList.add("sudokuRow")
        for (let j = 0; j < 9; j++) {
            const inp = document.createElement("input")
            inp.type = "number"
            newRow.appendChild(inp)
        }
        sudokuElement.appendChild(newRow)
    }

    return sudokuElement
}


export { createSudokuElement }