'use client';

import React, { useRef, useState } from 'react';

import { TextArea } from '../TextArea';
import { TextStyles } from '../TextStyles';
import { UndoRedo } from '../UndoRedo';

// Define a type for the style object
interface TextStyle {
  fontSize: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

export const TextEditor = () => {
  // State for managing the text and style
  const [text, setText] = useState<string>('Abhinav');
  const [style, setStyle] = useState<TextStyle>({
    fontSize: '20px',
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
  });

  // History for undo/redo
  const [history, setHistory] = useState<{ text: string; style: TextStyle }[]>([
    { text, style },
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [initialPos, setInitialPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  // Reference for the text area to calculate boundaries
  const textAreaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Handle undo and redo in UndoRedo component

  // Update history with new text and style
  const updateHistory = (newText: string, newStyle: TextStyle) => {
    const newHistory = [
      ...history.slice(0, currentIndex + 1),
      { text: newText, style: newStyle },
    ];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Mouse event handlers for drag and drop of the text
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: position.x, y: position.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && textAreaRef.current && textRef.current) {
      const textAreaRect = textAreaRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = initialPos.x + deltaX;
      const newY = initialPos.y + deltaY;

      // Calculate the boundaries for both X and Y axes
      const minX = 0;
      const minY = 0;
      const maxX = textAreaRect.width - textRect.width;
      const maxY = textAreaRect.height - textRect.height;

      // Restrict the new position within the boundaries
      const boundedX = Math.max(minX, Math.min(newX, maxX));
      const boundedY = Math.max(minY, Math.min(newY, maxY));

      setPosition({ x: boundedX, y: boundedY });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-8 p-8'>
      {/* Undo/Redo buttons */}
      <UndoRedo
        history={history}
        setText={setText}
        setStyle={setStyle}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />

      {/* Text Area */}
      <TextArea
        text={text}
        style={style}
        position={position}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        textAreaRef={textAreaRef}
        textRef={textRef}
      />

      {/* Font, Size, Style controls */}
      <TextStyles
        style={style}
        setStyle={setStyle}
        updateHistory={updateHistory}
        text={text}
      />
    </div>
  );
};
