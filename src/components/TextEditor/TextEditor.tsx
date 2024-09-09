'use client';

import React, { useRef, useState } from 'react';

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

  // Handle undo
  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setText(history[prevIndex].text);
      setStyle(history[prevIndex].style);
      setCurrentIndex(prevIndex);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      setText(history[nextIndex].text);
      setStyle(history[nextIndex].style);
      setCurrentIndex(nextIndex);
    }
  };

  // Record changes in history for undo/redo
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

  // Text Change handler
  //   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const newText = e.target.value;
  //     setText(newText);
  //     updateHistory(newText, style);   // Update history with the new text and current style
  //   };

  // Style Change handler with explicit type casting
  const handleStyleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const newStyle = { ...style };

    if (name === 'fontWeight') {
      newStyle.fontWeight = value as 'normal' | 'bold'; // Explicitly cast to the allowed string literals
    } else if (name === 'fontStyle') {
      newStyle.fontStyle = value as 'normal' | 'italic'; // Explicitly cast to the allowed string literals
    } else if (name === 'fontSize') {
      newStyle.fontSize = `${value}px`; // Update font size
    } else if (name === 'fontFamily') {
      newStyle.fontFamily = value; // Update font family
    }

    setStyle(newStyle);
    updateHistory(text, newStyle); // Update history with the new style and current text
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-8 p-8'>
      {/* Undo/Redo buttons */}
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

      {/* Fixed Text Area (Canvas) */}
      <div
        className='border-2 border-green-500 w-80 h-80 relative'
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={textAreaRef}
      >
        {/* Draggable Text Field inside the canvas */}
        <div
          className='absolute text-center bg-transparent border-none outline-none'
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            cursor: dragging ? 'grabbing' : 'grab', // Visual feedback for dragging
          }}
          onMouseDown={handleMouseDown}
          ref={textRef}
        >
          {text}
        </div>
      </div>

      {/* Font, Size, Style controls */}
      <div className='flex flex-col space-y-4 w-80'>
        <label className='flex items-center space-x-2'>
          Font Size:
          <input
            type='range'
            name='fontSize'
            min='10'
            max='50'
            value={parseInt(style.fontSize, 10)}
            onChange={handleStyleChange}
            className='w-full'
          />
        </label>

        <label className='flex items-center space-x-2'>
          Font Family:
          <select
            name='fontFamily'
            value={style.fontFamily}
            onChange={handleStyleChange}
            className='w-full'
          >
            <option value='Arial'>Arial</option>
            <option value='Georgia'>Georgia</option>
            <option value='Courier New'>Courier New</option>
          </select>
        </label>

        <label className='flex items-center space-x-2'>
          Font Weight:
          <select
            name='fontWeight'
            value={style.fontWeight}
            onChange={handleStyleChange}
            className='w-full'
          >
            <option value='normal'>Normal</option>
            <option value='bold'>Bold</option>
          </select>
        </label>

        <label className='flex items-center space-x-2'>
          Font Style:
          <select
            name='fontStyle'
            value={style.fontStyle}
            onChange={handleStyleChange}
            className='w-full'
          >
            <option value='normal'>Normal</option>
            <option value='italic'>Italic</option>
          </select>
        </label>

        <button className='bg-green-500 text-white py-2 px-4 rounded w-full'>
          Add Text
        </button>
      </div>
    </div>
  );
};
