'use client';

import { GameMode } from '@/hooks/useGame';
import { Difficulty } from '@/lib/aiLogic';

interface GameControlsProps {
  onResetGame: () => void;
  onUndoMove: () => void;
  gameMode: GameMode;
  aiDifficulty: Difficulty;
  onGameModeChange: (mode: GameMode) => void;
  onAIDifficultyChange: (difficulty: Difficulty) => void;
  onResetScores: () => void;
  canUndo: boolean;
  isAITurn: boolean;
}

export const GameControls = ({
  onResetGame,
  onUndoMove,
  gameMode,
  aiDifficulty,
  onGameModeChange,
  onAIDifficultyChange,
  onResetScores,
  canUndo,
  isAITurn,
}: GameControlsProps) => {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      {/* Game Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onResetGame}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-green-500 focus:ring-offset-2"
        >
          New Game
        </button>
        <button
          onClick={onUndoMove}
          disabled={!canUndo || isAITurn}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-yellow-500 focus:ring-offset-2"
        >
          Undo Move
        </button>
      </div>

      {/* Game Mode Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Game Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onGameModeChange('pvp')}
            className={`px-3 py-2 rounded-lg border-2 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       ${gameMode === 'pvp' 
                         ? 'bg-blue-600 text-white border-blue-600' 
                         : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                       }`}
          >
            Player vs Player
          </button>
          <button
            onClick={() => onGameModeChange('pve')}
            className={`px-3 py-2 rounded-lg border-2 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       ${gameMode === 'pve' 
                         ? 'bg-blue-600 text-white border-blue-600' 
                         : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                       }`}
          >
            Player vs AI
          </button>
        </div>
      </div>

      {/* AI Difficulty Selection */}
      {gameMode === 'pve' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">AI Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onAIDifficultyChange(difficulty)}
                className={`px-3 py-2 rounded-lg border-2 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           ${aiDifficulty === difficulty 
                             ? 'bg-blue-600 text-white border-blue-600' 
                             : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                           }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset Scores */}
      <button
        onClick={onResetScores}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                   transition-colors duration-200 focus:outline-none focus:ring-2 
                   focus:ring-red-500 focus:ring-offset-2"
      >
        Reset Scores
      </button>
    </div>
  );
};
