import { Board, Player, getAvailableMoves, checkWinner, checkDraw } from './gameLogic';

export type Difficulty = 'easy' | 'medium' | 'hard';

// AI player makes a move based on difficulty
export const makeAIMove = (board: Board, difficulty: Difficulty, aiPlayer: Player): number => {
  switch (difficulty) {
    case 'easy':
      return makeRandomMove(board);
    case 'medium':
      return makeMediumMove(board, aiPlayer);
    case 'hard':
      return makeHardMove(board, aiPlayer);
    default:
      return makeRandomMove(board);
  }
};

// Easy AI: Random moves
const makeRandomMove = (board: Board): number => {
  const availableMoves = getAvailableMoves(board);
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

// Medium AI: Mix of random and strategic moves
const makeMediumMove = (board: Board, aiPlayer: Player): number => {
  // 70% chance of making a strategic move, 30% chance of random move
  if (Math.random() < 0.7) {
    const strategicMove = findStrategicMove(board, aiPlayer);
    if (strategicMove !== -1) {
      return strategicMove;
    }
  }
  return makeRandomMove(board);
};

// Hard AI: Unbeatable using minimax algorithm
const makeHardMove = (board: Board, aiPlayer: Player): number => {
  const availableMoves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    const score = minimax(newBoard, 0, false, aiPlayer);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

// Minimax algorithm for unbeatable AI
const minimax = (board: Board, depth: number, isMaximizing: boolean, aiPlayer: Player): number => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  
  // Terminal conditions
  const winner = checkWinner(board);
  if (winner === aiPlayer) {
    return 10 - depth; // AI wins
  }
  if (winner === humanPlayer) {
    return depth - 10; // Human wins
  }
  if (checkDraw(board)) {
    return 0; // Draw
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = aiPlayer;
      const score = minimax(newBoard, depth + 1, false, aiPlayer);
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = humanPlayer;
      const score = minimax(newBoard, depth + 1, true, aiPlayer);
      bestScore = Math.min(bestScore, score);
    }
    return bestScore;
  }
};

// Find strategic moves for medium AI
const findStrategicMove = (board: Board, aiPlayer: Player): number => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  
  // 1. Try to win in one move
  for (const move of getAvailableMoves(board)) {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    if (checkWinner(newBoard) === aiPlayer) {
      return move;
    }
  }
  
  // 2. Block opponent from winning
  for (const move of getAvailableMoves(board)) {
    const newBoard = [...board];
    newBoard[move] = humanPlayer;
    if (checkWinner(newBoard) === humanPlayer) {
      return move;
    }
  }
  
  // 3. Try to take center
  if (board[4] === null) {
    return 4;
  }
  
  // 4. Try to take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(corner => board[corner] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // 5. Try to take edges
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter(edge => board[edge] === null);
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }
  
  return -1; // No strategic move found
};

// Get AI move with delay for better UX
export const getAIMoveWithDelay = (
  board: Board, 
  difficulty: Difficulty, 
  aiPlayer: Player,
  delay: number = 500
): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const move = makeAIMove(board, difficulty, aiPlayer);
      resolve(move);
    }, delay);
  });
};
