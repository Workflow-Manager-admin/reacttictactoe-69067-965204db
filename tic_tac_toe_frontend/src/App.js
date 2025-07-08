import React, { useState, useEffect } from "react";
import "./App.css";

// Theme palette
const THEME = {
  primary: "#1976d2",
  accent: "#ff9800",
  secondary: "#424242",
  light: "#ffffff",
  border: "#e0e0e0",
  boardBg: "#f9fafe",
  boardShadow: "0 4px 24px rgba(33, 41, 66, 0.08)",
};

// Silent utility to get initial score from localStorage
function getInitialScore() {
  try {
    const score = JSON.parse(localStorage.getItem("ttt_score"));
    return score || { X: 0, O: 0, Draw: 0 };
  } catch {
    return { X: 0, O: 0, Draw: 0 };
  }
}

// PUBLIC_INTERFACE
function App() {
  // --- State for the game ---
  // The board array, X goes first.
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("ongoing"); // "ongoing", "win", "draw"
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(getInitialScore);

  // Reset game but keep score
  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus("ongoing");
    setWinner(null);
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (board[i] || status !== "ongoing") {
      return;
    }
    const nextBoard = [...board];
    nextBoard[i] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext((prev) => !prev);
  }

  // Check for win/draw after every move
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus("win");
      setWinner(winner);
      setScore((prev) => {
        const updated = { ...prev, [winner]: (prev[winner] || 0) + 1 };
        localStorage.setItem("ttt_score", JSON.stringify(updated));
        return updated;
      });
    } else if (board.every(Boolean)) {
      setStatus("draw");
      setWinner(null);
      setScore((prev) => {
        const updated = { ...prev, Draw: (prev.Draw || 0) + 1 };
        localStorage.setItem("ttt_score", JSON.stringify(updated));
        return updated;
      });
    } else {
      setStatus("ongoing");
      setWinner(null);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClearScore() {
    setScore({ X: 0, O: 0, Draw: 0 });
    localStorage.removeItem("ttt_score");
  }

  // Render UI
  return (
    <div style={{ minHeight: "100vh", background: THEME.light }}>
      <header
        style={{
          background: THEME.primary,
          color: "#fff",
          padding: "2rem 0",
          marginBottom: "2rem",
          textAlign: "center",
          letterSpacing: "1px",
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.03)",
        }}
      >
        <h1 style={{
          margin: 0,
          fontWeight: 700,
          fontSize: "2.2rem",
        }}>
          Tic Tac Toe
        </h1>
        <span
          style={{
            background: THEME.accent,
            borderRadius: "6px",
            padding: "0.3rem 0.9rem",
            color: "#fff",
            fontWeight: 500,
            fontSize: "1rem",
            marginLeft: "0.7rem",
            letterSpacing: "0.05em",
          }}
        >
          Minimal React
        </span>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* Scoreboard */}
        <section
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            gap: "2rem",
            background: "#f6f7fb",
            borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(33,41,66,0.04)",
            padding: "1rem 2.5rem",
            fontSize: "1.04rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          <span style={{ color: THEME.primary }}>X: {score.X}</span>
          <span style={{ color: THEME.secondary }}>O: {score.O}</span>
          <span style={{ color: THEME.accent }}>Draw: {score.Draw}</span>
          <button
            onClick={handleClearScore}
            style={{
              marginLeft: "1.5rem",
              padding: "0.3rem 0.9rem",
              borderRadius: 8,
              border: "none",
              background: THEME.primary,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.98rem",
              cursor: "pointer",
              opacity: 0.86,
              transition: "opacity 0.2s",
            }}
            aria-label="Clear score"
            title="Clear all scores"
          >
            Clear Score
          </button>
        </section>

        {/* Status display */}
        <section
          style={{
            marginBottom: "1rem",
            fontSize: "1.15rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
            color: status === "win"
              ? THEME.primary
              : status === "draw"
                ? THEME.accent
                : THEME.secondary,
          }}
        >
          {status === "ongoing" && (
            <span>
              Next turn:{" "}
              <span style={{
                color: isXNext ? THEME.primary : THEME.secondary,
                fontWeight: 600,
                fontSize: "1.19rem",
              }}>
                {isXNext ? "X" : "O"}
              </span>
            </span>
          )}
          {status === "win" && (
            <span>
              Winner:{" "}
              <span style={{
                color: winner === "X" ? THEME.primary : THEME.secondary,
                fontWeight: 700,
                fontSize: "1.22rem",
              }}>
                {winner}
              </span>
              {" "}🎉
            </span>
          )}
          {status === "draw" && (
            <span>
              It's a <span style={{ color: THEME.accent, fontWeight: 600 }}>draw</span>!
            </span>
          )}
        </section>

        {/* Game Board */}
        <TicTacToeBoard
          board={board}
          onSquareClick={handleSquareClick}
          status={status}
          theme={THEME}
        />

        {/* Restart button */}
        <button
          onClick={handleRestart}
          style={{
            marginTop: "2.1rem",
            background: THEME.accent,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "0.75rem 1.9rem",
            fontWeight: 700,
            fontSize: "1.12rem",
            letterSpacing: "0.02em",
            boxShadow: "0 2px 8px rgba(255, 152, 0, 0.07)",
            cursor: "pointer",
            opacity: 0.97,
            transition: "opacity 0.18s",
          }}
          aria-label="Restart game"
        >
          Restart Game
        </button>
      </main>
      <footer
        style={{
          marginTop: "2.8rem",
          marginBottom: "0.5rem",
          textAlign: "center",
          fontSize: "0.98rem",
          color: "#9da1b0",
          letterSpacing: "0.03em",
          userSelect: "none",
        }}
      >
        © {new Date().getFullYear()} Tic Tac Toe. Minimal UI powered by React.
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function TicTacToeBoard({ board, onSquareClick, status, theme }) {
  const renderSquare = (i) => (
    <button
      key={i}
      style={{
        width: "72px",
        height: "72px",
        background: theme.light,
        border: `2.4px solid ${theme.border}`,
        borderRadius: "16px",
        boxShadow: status === "ongoing" && !board[i]
          ? "0 1px 8px rgba(33,41,66,0.06)"
          : "none",
        fontSize: "2.1rem",
        fontWeight: 700,
        color: board[i]
          ? board[i] === "X" ? theme.primary : theme.secondary
          : "#c5c7cb",
        cursor: status === "ongoing" && !board[i] ? "pointer" : "default",
        outline: "none",
        margin: "0.2rem",
        transition: "all 0.14s",
        userSelect: "none",
        opacity: board[i] ? 0.96 : 0.86,
      }}
      aria-label={`Square ${i + 1}${board[i] ? `: ${board[i]}` : ""}`}
      onClick={() => onSquareClick(i)}
      disabled={!!board[i] || status !== "ongoing"}
    >
      {board[i]}
    </button>
  );

  // Responsive CSS grid
  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe Board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 72px)",
        gridTemplateRows: "repeat(3, 72px)",
        gap: "0.5rem",
        background: theme.boardBg,
        borderRadius: "20px",
        boxShadow: theme.boardShadow,
        padding: "18px",
        margin: "auto",
        minWidth: "max-content",
        justifyContent: "center",
      }}
    >
      {board.map((_, i) => renderSquare(i))}
    </div>
  );
}

// --- Helper: Game logic (public, documented) ---
// PUBLIC_INTERFACE
/**
 * Checks if someone won the Tic Tac Toe game.
 * @param {string[]} squares - The board array.
 * @returns {"X"|"O"|null} - The winner (if any).
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
