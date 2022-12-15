const getClearMap = () => {
    return [
        '','','','','',
        '','','','','',
        '','','','','',
        '','','','','',
        '','','','',''
    ]
}
// TODO переписать комбинации
const WIN_COMBINATION = [
    [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
    [0,5,10,15,20], [1,6,11,16,21], [2,7,12, 17, 22], [3,8,13,18,23], [4,9,14,19,24],
    [0,6,12,18,24], [4,8,12,16,20]
]

function checkIsGameEnd(map) {
    return WIN_COMBINATION.some(combination => {
        return combination.every(position => map[position] === 'X') ||
        combination.every(position => map[position] === 'O')
    })
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
        const isFieldCorrect = stepData.field >= 0 && stepData.field <= 25
        const isMapEmpty = this.map.every(f => f === '')
        const isStepsLengthZero = this.steps.length === 0

        if (isFieldCorrect && isMapEmpty && isStepsLengthZero) {
            const step = {
                id: 0,
                prevStepId: undefined,
                field: stepData.field,
            }

            this.steps = [step]
            this.map = [...this.map.slice(0, stepData.field), 'O', ...this.map.slice(stepData.field + 1)]
            this.status = 'game'

            return { result: true }
        } else {
            return { result: false }
        }
    }

    step(stepData) {
        const isProgression = this.steps.length > 0 && this.steps.slice(-1)[0].id === stepData.prevStepId
        const isFieldCorrect = stepData.field >= 0 && stepData.field <= 25 && this.map[stepData.field] === ''
        const isGameStatusCorrect = this.status === 'game'

        if (isProgression && isFieldCorrect && isGameStatusCorrect) {
            const step = {
                id: this.steps.length,
                prevStepId: this.steps.length - 1,
                field: stepData.field
            }

            const fieldData = this.steps.length % 2 === 1 ? 'X' : 'O'

            this.steps = [...this.steps, step]
            this.map = [...this.map.slice(0, stepData.field), fieldData, ...this.map.slice(stepData.field + 1)]

            this.checkGameEnd()

            return { result: true }
        } else {
            return { result: false }
        }
    }

    checkGameEnd() {
        const isGameEnd = this.steps.length >= 5 && checkIsGameEnd(this.map)

        if (isGameEnd) {
            this.status = 'finished'
        }
    }
}
