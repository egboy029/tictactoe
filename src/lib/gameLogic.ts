export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  gameHistory: Board[];
  currentMoveIndex: number;
}

// Winning combinations (indices)
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Diagonal
];

// Initialize empty board
export const createEmptyBoard = (): Board => Array(9).fill(null);

// Check if a player has won
export const checkWinner = (board: Board): Player | null => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Check if the game is a draw
export const checkDraw = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

// Get winning combination for highlighting
export const getWinningCombination = (board: Board): number[] | null => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combination;
    }
  }
  return null;
};

// Make a move on the board
export const makeMove = (board: Board, index: number, player: Player): Board => {
  if (board[index] !== null) {
    throw new Error('Cell is already occupied');
  }
  
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
};

// Get available moves (empty cells)
export const getAvailableMoves = (board: Board): number[] => {
  return board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);
};

// Check if the game is over
export const isGameOver = (board: Board): boolean => {
  return checkWinner(board) !== null || checkDraw(board);
};

// Get game status message
export const getGameStatus = (gameState: GameState): string => {
  if (gameState.winner) {
    return `Player ${gameState.winner} wins!`;
  }
  if (gameState.isDraw) {
    return "It's a draw!";
  }
  return `Player ${gameState.currentPlayer}'s turn`;
};

// Initialize new game state
export const initializeGame = (): GameState => ({
  board: createEmptyBoard(),
  currentPlayer: 'X',
  winner: null,
  isDraw: false,
  gameHistory: [createEmptyBoard()],
  currentMoveIndex: 0,
});

// Update game state after a move
export const updateGameState = (
  currentState: GameState,
  moveIndex: number
): GameState => {
  const newBoard = makeMove(currentState.board, moveIndex, currentState.currentPlayer);
  const winner = checkWinner(newBoard);
  const isDraw = !winner && checkDraw(newBoard);
  
  const newHistory = [...currentState.gameHistory.slice(0, currentState.currentMoveIndex + 1), newBoard];
  
  return {
    board: newBoard,
    currentPlayer: currentState.currentPlayer === 'X' ? 'O' : 'X',
    winner,
    isDraw,
    gameHistory: newHistory,
    currentMoveIndex: currentState.currentMoveIndex + 1,
  };
};

// Undo last move
export const undoMove = (currentState: GameState): GameState => {
  if (currentState.currentMoveIndex <= 0) {
    return currentState;
  }
  
  const newMoveIndex = currentState.currentMoveIndex - 1;
  const previousBoard = currentState.gameHistory[newMoveIndex];
  const winner = checkWinner(previousBoard);
  const isDraw = !winner && checkDraw(previousBoard);
  
  return {
    board: previousBoard,
    currentPlayer: currentState.currentPlayer === 'X' ? 'O' : 'X',
    winner,
    isDraw,
    gameHistory: currentState.gameHistory,
    currentMoveIndex: newMoveIndex,
  };
};

// Reset game
export const resetGame = (): GameState => {
  return initializeGame();
};
