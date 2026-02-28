import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() { }

function getWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [board[a], lines[i]]
    }
  }
  return null
}

function Square({ className, value, handleClick }) {
  return <button
    className={className}
    onClick={handleClick}
  >
    {value}
  </button>
}

function Board({ winnerLine, squares, handleGame, turn }) {
  function handleClick(i) {
    if (squares[i] || getWinner(squares)) return
    const tempSquares = squares.slice()
    tempSquares[i] = turn
    handleGame(tempSquares)
  }

  function BoardRows() {
    let rows = []
    for (let i = 0; i < 9; i += 3) {
      rows.push(
        <div className='board-row' key={i}>
          <Square key={i} className={winnerLine.includes(i) ? 'winner' : 'square'} value={squares[i]} handleClick={() => handleClick(i)} />
          <Square key={i + 1} className={winnerLine.includes(i + 1) ? 'winner' : 'square'} value={squares[i + 1]} handleClick={() => handleClick(i + 1)} />
          <Square key={i + 2} className={winnerLine.includes(i + 2) ? 'winner' : 'square'} value={squares[i + 2]} handleClick={() => handleClick(i + 2)} />
        </div>
      )
    }
    return rows
  }

  return (
    <>
      <BoardRows />
    </>
  )
}

export default function Game() {
  const [squaresList, setSquaresList] = useState([Array(9).fill(null)])
  const [turn, setTurn] = useState('X')
  const [currentMove, setCurrentMove] = useState(0)
  const [winner, setWinner] = useState(null)
  const [winnerLine, setWinnerLine] = useState([])

  function handleGame(nextSquares) {
    setSquaresList([...squaresList, nextSquares])
    setTurn(turn === 'X' ? 'O' : 'X')
    setCurrentMove(currentMove + 1)

    const result = getWinner(nextSquares); // Store result first

    if (result) {
      const [winnerName, line] = result;
      setWinner(winnerName);
      setWinnerLine(line);
    } else if (currentMove === 8) {
      setWinner('Draw');
    }
  }

  console.log(squaresList)

  function jumpToMove(move) {
    setSquaresList(squaresList.slice(0, move + 1))
    setTurn(move % 2 === 0 ? 'X' : 'O')
    setCurrentMove(move)
  }

  const moves = squaresList.map((squares, move) => {
    if (move == currentMove) {
      return (
        <li key={move}>
          You are at move #{move}
        </li>
      )
    }
    else {
      return (
        <li key={move}>
          <button onClick={() => jumpToMove(move)}>Go to move #{move}</button>
        </li>
      )
    }
  })

  return (
    <div className="game">
      <div className="status">The Winner is {winner}</div>
      <div className="game-board">
        <Board winnerLine={winnerLine} squares={squaresList[squaresList.length - 1]} handleGame={handleGame} turn={turn} />
      </div>
      <div className="game-status">
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  )
}
