import React from 'react';

// Define the TextStyle type for style consistency
interface TextStyle {
  fontSize: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

interface UndoRedoProps {
  history: { text: string; style: TextStyle }[]; // Updated to use TextStyle
  setText: React.Dispatch<React.SetStateAction<string>>;
  setStyle: React.Dispatch<React.SetStateAction<TextStyle>>; // Updated to use TextStyle
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const UndoRedo: React.FC<UndoRedoProps> = ({
  history,
  setText,
  setStyle,
  currentIndex,
  setCurrentIndex,
}) => {
  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setText(history[prevIndex].text);
      setStyle(history[prevIndex].style);
      setCurrentIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      setText(history[nextIndex].text);
      setStyle(history[nextIndex].style);
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className='flex space-x-4'>
      <button
        className='bg-blue-500 text-white py-2 px-4 rounded'
        onClick={handleUndo}
      >
        Undo
      </button>
      <button
        className='bg-blue-500 text-white py-2 px-4 rounded'
        onClick={handleRedo}
      >
        Redo
      </button>
    </div>
  );
};
