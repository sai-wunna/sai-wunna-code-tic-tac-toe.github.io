document.addEventListener('DOMContentLoaded', function () {
  const getNode = (node) => document.querySelector(node)
  const boxWrapper = getNode('.listener')
  const winnerBox = getNode('.winnerBox')
  const restartGameBtn = getNode('#restart')
  const keyHolder = {
    box_1: false,
    box_2: false,
    box_3: false,
    box_4: false,
    box_5: false,
    box_6: false,
    box_7: false,
    box_8: false,
    box_9: false,
  }
  const userMoves = []
  const computerMoves = []
  let gameOver = false
  let winner
  const winPatterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ]
  // to remove the hover effect for the taken ones
  const nextTurnShowMaker = () => {
    for (key in keyHolder) {
      if (keyHolder[key]) {
        getNode(`#${key}`).classList.remove(`next_1`)
      }
    }
  }

   const computerMove = () => {
    const availableMoves = Object.keys(keyHolder).filter(
      (one) => !keyHolder[one]
    )
    const smartKeys = [1, 3, 7, 9]
    if (!gameOver) {
      let winningKey
      let key
      for (let pattern of winPatterns) {
        const [a, b, c] = pattern
        if (
          computerMoves.includes(a) &&
          computerMoves.includes(b) &&
          availableMoves.includes(`box_${c}`)
        ) {
          key = c
          winningKey = c
        } else if (
          computerMoves.includes(b) &&
          computerMoves.includes(c) &&
          availableMoves.includes(`box_${a}`)
        ) {
          key = a
          winningKey = a
        } else if (
          computerMoves.includes(a) &&
          computerMoves.includes(c) &&
          availableMoves.includes(`box_${b}`)
        ) {
          key = b
          winningKey = b
        } else if (
          userMoves.includes(a) &&
          userMoves.includes(b) &&
          availableMoves.includes(`box_${c}`)
        ) {
          key = c
        } else if (
          userMoves.includes(b) &&
          userMoves.includes(c) &&
          availableMoves.includes(`box_${a}`)
        ) {
          key = a
        } else if (
          userMoves.includes(a) &&
          userMoves.includes(c) &&
          availableMoves.includes(`box_${b}`)
        ) {
          key = b
        }
      }
      if (winningKey) {
        key = winningKey
      }
      if (!key && userMoves.length === 1) {
        key = userMoves[0] === 5 ? 1 : 5
      }
      if (!key && userMoves.length === 2) {
        if (userMoves.includes(2) && userMoves.includes(4)) {
          key = 1
        } else if (userMoves.includes(6) && userMoves.includes(8)) {
          key = 9
        } else if (userMoves.includes(1) && userMoves.includes(9)) {
          key = 2
        } else if (userMoves.includes(3) && userMoves.includes(7)) {
          key = 8
        } else if (userMoves.includes(4) && userMoves.includes(8)) {
          key = 7
        } else if (userMoves.includes(1) && userMoves.includes(8)) {
          key = 7
        } else if (userMoves.includes(3) && userMoves.includes(8)) {
          key = 7
        } else if (userMoves.includes(2) && userMoves.includes(6)) {
          key = 3
        } else if (userMoves.includes(2) && userMoves.includes(9)) {
          key = 3
        } else if (userMoves.includes(2) && userMoves.includes(7)) {
          key = 1
        }
      }
      if (!key) {
        for (let smKey of smartKeys) {
          if (availableMoves.includes(`box_${smKey}`)) {
            key = smKey
          }
        }
      }
      if (!key) {
        const randomNumber = Math.floor(Math.random() * availableMoves.length)
        key = parseInt(availableMoves[randomNumber].split('_')[1])
      }
      computerMoves.push(key)
      keyHolder[`box_${key}`] = 2
      getNode(`#box_${key}`).classList.add(`active_${2}`)
    }
    nextTurnShowMaker()
  }

  const endGameChecker = (moves) => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (moves.includes(a) && moves.includes(b) && moves.includes(c)) {
        winner = userMoves.includes(a) ? 'User' : 'Computer'
        gameOver = true
        for (key in pattern) {
          getNode(`#box_${pattern[key]}`).classList.add('bingo')
        }
      }
    }
  }

  boxWrapper.addEventListener('click', (e) => {
    if (gameOver) return
    const key = e.target
    if (!Object.keys(keyHolder).some((one) => one.toString() === key.id)) return
    if (keyHolder[key.id]) return
    userMoves.push(parseInt(key.id.split('_')[1]))
    keyHolder[key.id] = 1
    getNode(`#${key.id}`).classList.add(`active_1`)
    endGameChecker(userMoves)
    if (gameOver) {
      winnerBox.textContent = `${winner} win`
    }
    if (userMoves.length === 5 && !gameOver) {
      winnerBox.textContent = `Draw`
      gameOver = true
      return
    }
    computerMove()
    endGameChecker(computerMoves)
    if (gameOver) {
      winnerBox.textContent = `${winner} win`
    }
  })

  restartGameBtn.addEventListener('click', () => {
    if (!gameOver) return
    for (key in keyHolder) {
      keyHolder[key] = false
      getNode(`#${key}`).classList.remove(`active_1`)
      getNode(`#${key}`).classList.remove(`active_2`)
      getNode(`#${key}`).classList.add(`next_1`)
      getNode(`#${key}`).classList.remove(`bingo`)
    }
    userMoves.splice(0)
    computerMoves.splice(0)
    gameOver = false
    winner = ''
    winnerBox.textContent = '. . . .'
  })
})
