'use client';

import { CellValue } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';

interface CellProps {
  value: CellValue;
  index: number;
  isWinningCell: boolean;
  isAITurn: boolean;
  onClick: (index: number) => void;
}

export const Cell = ({ value, index, isWinningCell, isAITurn, onClick }: CellProps) => {
  const handleClick = () => {
    if (value === null && !isAITurn) {
      onClick(index);
    }
  };

  const getCellContent = () => {
    if (value === null) return null;
    
    return (
      <span className={cn(
        "text-4xl font-bold transition-all duration-300 ease-in-out",
        value === 'X' ? "text-blue-600" : "text-red-600",
        isWinningCell && "scale-110 animate-pulse"
      )}>
        {value}
      </span>
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={value !== null || isAITurn}
      className={cn(
        "w-20 h-20 border-2 border-gray-300 bg-white hover:bg-gray-50",
        "flex items-center justify-center transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-100",
        value === null && !isAITurn && "hover:border-blue-400 hover:shadow-md",
        isWinningCell && "bg-yellow-100 border-yellow-400 shadow-lg",
        isAITurn && "cursor-wait"
      )}
      aria-label={`Cell ${index + 1}, ${value ? `contains ${value}` : 'empty'}`}
    >
      {getCellContent()}
    </button>
  );
};
