'use client';

import { useGame } from '@/hooks/useGame';
import { Board } from './Board';
import { GameInfo } from './GameInfo';
import { GameControls } from './GameControls';

export const TicTacToe = () => {
  const {
    gameState,
    gameMode,
    aiDifficulty,
    isAITurn,
    playerNames,
    scores,
    makeMove,
    resetGame,
    undoMove,
    setGameMode,
    setAIDifficulty,
    setPlayerNames,
    resetScores,
  } = useGame();

  const canUndo = gameState.currentMoveIndex > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎮 Tic Tac Toe
          </h1>
          <p className="text-gray-600">
            Classic game with modern features and AI opponents
          </p>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Info */}
          <div className="lg:col-span-1">
            <GameInfo
              gameState={gameState}
              gameMode={gameMode}
              aiDifficulty={aiDifficulty}
              isAITurn={isAITurn}
              playerNames={playerNames}
              scores={scores}
            />
          </div>

          {/* Game Board */}
          <div className="lg:col-span-1 flex justify-center">
            <Board
              board={gameState.board}
              isAITurn={isAITurn}
              onCellClick={makeMove}
            />
          </div>

          {/* Game Controls */}
          <div className="lg:col-span-1">
            <GameControls
              onResetGame={resetGame}
              onUndoMove={undoMove}
              gameMode={gameMode}
              aiDifficulty={aiDifficulty}
              onGameModeChange={setGameMode}
              onAIDifficultyChange={setAIDifficulty}
              onResetScores={resetScores}
              canUndo={canUndo}
              isAITurn={isAITurn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
