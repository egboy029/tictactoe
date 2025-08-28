'use client';

import { getWinningCombination } from '@/lib/gameLogic';
import { Cell } from './Cell';

interface BoardProps {
  board: (string | null)[];
  isAITurn: boolean;
  onCellClick: (index: number) => void;
}

export const Board = ({ board, isAITurn, onCellClick }: BoardProps) => {
  const winningCombination = getWinningCombination(board);

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 rounded-lg shadow-lg">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          isWinningCell={winningCombination?.includes(index) || false}
          isAITurn={isAITurn}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
};
