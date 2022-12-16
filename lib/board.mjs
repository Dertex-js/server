const getClearMap = () => {
    const N = 20
    const matrix = []
    for (let i = 0; i < N; i++) {
        matrix[i] = new Array(N).fill('')
    }

    // for (let i = 0; i < N; i++) {
    //     matrix[i] = []
    //     for (let j = 0; j < N; j++) {
    //         matrix[i][j] = `${i},${j}`
    //     }
    // }
    return matrix
}

function checkIsGameEnd(map, {x, y}) {
    const startLeftX = x >= 4 ? x - 4 : 0
    const startRightX = x >= 15 ? 19 : x + 4
    const startTopY = y >= 4 ? y - 4 : 0
    const startBottomY = y >= 15 ? 19 : y + 4
    const arrY = []
    const arrX = []
    const arrYDiag = []
    const arrXDiag = []

    for (let i = startTopY; i <= startBottomY; i++) {
        arrY.push(map[i][x])
    }
    for (let j = startLeftX; j <= startRightX; j++) {
        arrX.push(map[y][j])
    }
    for (let i = -4; i <= 4; i++) {
        if (map[y + i]) {
            if (map[y + i][x + i]) {
                arrYDiag.push(map[y + i][x + i])
            }
        }
    }
    for (let i = -4; i <= 4; i++) {
        if (map[y + i]) {
            if (map[y + i][x - i]) {
                arrXDiag.push(map[y + i][x - i])
            }
        }
    }

    const checkIsWinCombination = (arr) => {
        return !!(arr.join("").indexOf("OOOOO") >= 0 || arr.join("").indexOf("XXXXX") >= 0)
    }

    const arrRow = arrY.map((item) => {
        if (item === "") {
            return  " "
        } else {
            return item
        }
    })

    const arrCol = arrX.map((item) => {
        if (item === "") {
            return  " "
        } else {
            return item
        }
    })

    const arrLeftDiag = arrYDiag.map((item) => {
        if (item === "") {
            return  " "
        } else {
            return item
        }
    })

    const arrRightDiag = arrXDiag.map((item) => {
        if (item === "") {
            return  " "
        } else {
            return item
        }
    })

    return !!(
      checkIsWinCombination(arrRow)
      || checkIsWinCombination(arrCol)
      || checkIsWinCombination(arrLeftDiag)
      || checkIsWinCombination(arrRightDiag)
    )
}

export class Board {
    static instance;
    map = getClearMap()
    steps = []
    status = 'before_start'

    constructor() {
    }

    static getInstance() {
        if (!Board.instance) {
            Board.instance = new Board()
        }

        return Board.instance
    }

    getCurrentGameState() {
        return { map: this.map, steps: this.steps, status: this.status }
    }

    clear() {
        this.status = 'before_start'
        this.map = getClearMap()
        this.steps = []
    }

    firstStep(stepData) {
        const isMapEmpty = this.map.every(f => f.every(f2 => f2 === ''))
        const isStepsLengthZero = this.steps.length === 0

        if (isMapEmpty && isStepsLengthZero) {
            const step = {
                id: 0,
                prevStepId: undefined,
                field: {x: stepData.x, y: stepData.y},
            }

            this.steps = [step]
            this.map[stepData.y][stepData.x] = 'O'
            this.status = 'game'

            return { result: true }
        } else {
            return { result: false }
        }
    }

    step(stepData) {
        const isProgression = this.steps.length > 0 && this.steps.slice(-1)[0].id === stepData.prevStepId
        const isFieldCorrect = this.map[stepData.y][stepData.x] === ''
        const isGameStatusCorrect = this.status === 'game'

        if (isProgression && isFieldCorrect && isGameStatusCorrect) {
            const step = {
                id: this.steps.length,
                prevStepId: this.steps.length - 1,
                field: {x: stepData.x, y: stepData.y}
            }

            const fieldData = this.steps.length % 2 === 1 ? 'X' : 'O'

            this.steps = [...this.steps, step]
            this.map[stepData.y][stepData.x] = fieldData

            this.checkGameEnd()

            return { result: true }
        } else {
            return { result: false }
        }
    }

    checkGameEnd() {
        if (checkIsGameEnd(this.map, this.steps[this.steps.length - 1].field)) {
            this.status = 'finished'
        }
    }
}
