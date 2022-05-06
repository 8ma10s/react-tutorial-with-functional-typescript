import React, {useState} from 'react';
import * as  ReactDOM from 'react-dom/client';
import './index.css';

type SquareValue = 'X' | 'O' | null;
type Squares = Array<SquareValue>;
type Step =  {
    squares: Squares
    xIsNext: boolean
}
type History = Array<Step>;

type SquareProps = {
    value: SquareValue
    onClick: () => void
}


const Square = (props: SquareProps) => (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
)

type BoardProps = {
    squares: Squares
    onClick: (i: number) => void
}

const Board = (props: BoardProps) => {

    const renderSquare = (i: number) => (
        <Square value={props.squares[i]} onClick={() => props.onClick(i)}/>
    )

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

type GameState = {
    history: History
}

const Game = () => {
    const [state, setState] = useState<GameState>({
            history: [{
                squares: Array(9).fill(null),
                xIsNext: true,
            }]
        })

    const renderJumpButton = (history: History) => {
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        return moves;
    }

    const jumpTo = (step: number) => {
        setState({
            history: state.history.slice(0, step + 1)
        })
    }

    const handleClick = (i: number) => {
        const history = state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = current.xIsNext ? 'X' : 'O';
        setState({
            history: history.concat([{
                    squares: squares,
                    xIsNext: !current.xIsNext,
                }]
            )}
        );
    }
    const history = state.history;
    const current = history[history.length - 1];
    const squares = current.squares;
    const winner = calculateWinner(current.squares);

    let status: string;
    if(winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={squares}
                    onClick={(i: number) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{renderJumpButton(history)}</ol>
            </div>
        </div>
    );
}

const calculateWinner = (squares: Squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// ========================================

const rootElement = document.getElementById('root');
if(!rootElement) {
    throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<Game />);
