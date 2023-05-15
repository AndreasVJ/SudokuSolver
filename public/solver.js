function possible(sudoku, x, y, n) {
    for (let i = 0; i < 9; i++) {
        if (sudoku[y][i] == n || sudoku[i][x] == n) {
            return false
        }
    }
    
    const x0 = Math.floor(x/3)*3
    const y0 = Math.floor(y/3)*3
    
    for (let i = y0; i < y0 + 3; i++) {
        for (let j = x0; j < x0 + 3; j++) {
            if (sudoku[i][j] == n) {
                return false
            }
        }
    }

    return true
}


function solveSudoku(sudoku) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (sudoku[y][x] == 0) {
                for (let n = 1; n < 10; n++) {
                    if (possible(sudoku, x, y, n)) {
                        sudoku[y][x] = n
                        if (y == 8 && x == 8) {
                            return sudoku
                        }
                        if (solveSudoku(sudoku)) {
                            return sudoku
                        }
                        sudoku[y][x] = 0
                    }
                }
                return false
            }
        }
    }
    

    return sudoku
}


export { solveSudoku }