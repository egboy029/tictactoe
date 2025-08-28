'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, updateGameState, resetGame, undoMove, initializeGame } from '@/lib/gameLogic';
import { Difficulty, getAIMoveWithDelay } from '@/lib/aiLogic';

export type GameMode = 'pvp' | 'pve';

interface UseGameReturn {
  gameState: GameState;
  gameMode: GameMode;
  aiDifficulty: Difficulty;
  isAITurn: boolean;
  playerNames: { X: string; O: string };
  scores: { X: number; O: number };
  makeMove: (index: number) => void;
  resetGame: () => void;
  undoMove: () => void;
  setGameMode: (mode: GameMode) => void;
  setAIDifficulty: (difficulty: Difficulty) => void;
  setPlayerNames: (names: { X: string; O: string }) => void;
  resetScores: () => void;
}

export const useGame = (): UseGameReturn => {
  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [aiDifficulty, setAIDifficulty] = useState<Difficulty>('medium');
  const [isAITurn, setIsAITurn] = useState(false);
  const [playerNames, setPlayerNames] = useState({ X: 'Player X', O: 'Player O' });
  const [scores, setScores] = useState({ X: 0, O: 0 });

  // Handle AI moves
  useEffect(() => {
    if (isAITurn && gameMode === 'pve' && !gameState.winner && !gameState.isDraw) {
      const aiPlayer = gameState.currentPlayer;
      const delay = aiDifficulty === 'hard' ? 800 : aiDifficulty === 'medium' ? 500 : 300;
      
      getAIMoveWithDelay(gameState.board, aiDifficulty, aiPlayer, delay)
        .then((move) => {
          handleMove(move);
          setIsAITurn(false);
        });
    }
  }, [isAITurn, gameMode, gameState.board, gameState.currentPlayer, gameState.winner, gameState.isDraw, aiDifficulty]);

  // Handle move logic
  const handleMove = useCallback((index: number) => {
    if (gameState.board[index] !== null || gameState.winner || gameState.isDraw) {
      return;
    }

    const newGameState = updateGameState(gameState, index);
    setGameState(newGameState);

    // Update scores if game ended
    if (newGameState.winner) {
      setScores(prev => ({
        ...prev,
        [newGameState.winner!]: prev[newGameState.winner!] + 1
      }));
    }

    // Trigger AI turn if in PvE mode and game isn't over
    if (gameMode === 'pve' && !newGameState.winner && !newGameState.isDraw) {
      setIsAITurn(true);
    }
  }, [gameState, gameMode]);

  // Make a move (called by player)
  const makeMove = useCallback((index: number) => {
    if (isAITurn) return; // Prevent moves during AI turn
    handleMove(index);
  }, [handleMove, isAITurn]);

  // Reset the current game
  const resetCurrentGame = useCallback(() => {
    setGameState(resetGame());
    setIsAITurn(false);
  }, []);

  // Undo the last move
  const undoLastMove = useCallback(() => {
    if (isAITurn) return; // Prevent undo during AI turn
    
    const newGameState = undoMove(gameState);
    setGameState(newGameState);
    
    // If we're in PvE mode and we undo an AI move, we need to undo twice
    if (gameMode === 'pve' && newGameState.currentMoveIndex < gameState.currentMoveIndex) {
      const finalGameState = undoMove(newGameState);
      setGameState(finalGameState);
    }
  }, [gameState, gameMode, isAITurn]);

  // Change game mode
  const handleGameModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameState(resetGame());
    setIsAITurn(false);
  }, []);

  // Change AI difficulty
  const handleAIDifficultyChange = useCallback((difficulty: Difficulty) => {
    setAIDifficulty(difficulty);
    if (gameMode === 'pve') {
      setGameState(resetGame());
      setIsAITurn(false);
    }
  }, [gameMode]);

  // Update player names
  const handlePlayerNamesChange = useCallback((names: { X: string; O: string }) => {
    setPlayerNames(names);
  }, []);

  // Reset scores
  const resetScores = useCallback(() => {
    setScores({ X: 0, O: 0 });
  }, []);

  return {
    gameState,
    gameMode,
    aiDifficulty,
    isAITurn,
    playerNames,
    scores,
    makeMove,
    resetGame: resetCurrentGame,
    undoMove: undoLastMove,
    setGameMode: handleGameModeChange,
    setAIDifficulty: handleAIDifficultyChange,
    setPlayerNames: handlePlayerNamesChange,
    resetScores,
  };
};
