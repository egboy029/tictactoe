'use client';

import { GameState, getGameStatus } from '@/lib/gameLogic';
import { GameMode, Difficulty } from '@/hooks/useGame';

interface GameInfoProps {
  gameState: GameState;
  gameMode: GameMode;
  aiDifficulty: Difficulty;
  isAITurn: boolean;
  playerNames: { X: string; O: string };
  scores: { X: number; O: number };
}

export const GameInfo = ({ 
  gameState, 
  gameMode, 
  aiDifficulty, 
  isAITurn, 
  playerNames, 
  scores 
}: GameInfoProps) => {
  const status = getGameStatus(gameState);
  const currentPlayerName = gameMode === 'pve' && gameState.currentPlayer === 'O' 
    ? `AI (${aiDifficulty})` 
    : playerNames[gameState.currentPlayer];

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      {/* Game Status */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {status}
        </h2>
        {!gameState.winner && !gameState.isDraw && (
          <p className="text-lg text-gray-600">
            Current Turn: <span className="font-semibold">{currentPlayerName}</span>
            {isAITurn && <span className="ml-2 text-blue-600">(Thinking...)</span>}
          </p>
        )}
      </div>

      {/* Game Mode Info */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Mode: <span className="font-medium">
            {gameMode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}
          </span>
          {gameMode === 'pve' && (
            <span className="ml-2">
              (Difficulty: <span className="font-medium capitalize">{aiDifficulty}</span>)
            </span>
          )}
        </p>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{playerNames.X}</div>
          <div className="text-lg text-gray-600">Score: {scores.X}</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {gameMode === 'pve' ? `AI (${aiDifficulty})` : playerNames.O}
          </div>
          <div className="text-lg text-gray-600">Score: {scores.O}</div>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="text-center text-sm text-gray-500">
        <p>Moves: {gameState.currentMoveIndex}</p>
      </div>
    </div>
  );
};
