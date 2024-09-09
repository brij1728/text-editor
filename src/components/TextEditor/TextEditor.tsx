'use client';

import React, { useState } from 'react';

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

  // Combine text and style into one object to track in the history
  interface HistoryEntry {
    text: string;
    style: TextStyle;
  }

  const [history, setHistory] = useState<HistoryEntry[]>([{ text, style }]);
  const [historyPointer, setHistoryPointer] = useState<number>(0);

  // Function to update the history
  const updateHistory = (newText: string, newStyle: TextStyle) => {
    const newHistory = [
      ...history.slice(0, historyPointer + 1),
      { text: newText, style: newStyle },
    ];
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  };

  // Text Change handler
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateHistory(newText, style); // Save the new text along with the current style to the history
  };

  // Style Change handler
  const handleStyleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const newStyle = { ...style, [name]: value } as TextStyle; // Cast to TextStyle

    setStyle(newStyle);
    updateHistory(text, newStyle); // Save the current text along with the new style to the history
  };

  // Undo functionality
  const handleUndo = () => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1;
      setHistoryPointer(prevPointer);
      setText(history[prevPointer].text);
      setStyle(history[prevPointer].style);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      const nextPointer = historyPointer + 1;
      setHistoryPointer(nextPointer);
      setText(history[nextPointer].text);
      setStyle(history[nextPointer].style);
    }
  };

  // Add new text functionality
  const addNewText = () => {
    const newText = 'New Text';
    setText(newText);
    updateHistory(newText, style);
  };

  // Mouse event handlers for drag and drop of the text
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY }); // Store the initial mouse click position
    setInitialPos({ x: position.x, y: position.y }); // Store the initial text position
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      // Calculate the new position based on the mouse movement and the initial positions
      const newX = initialPos.x + (e.clientX - dragStart.x);
      const newY = initialPos.y + (e.clientY - dragStart.y);
      setPosition({ x: newX, y: newY });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-8 p-8'>
      {/* Undo/Redo buttons */}
      <div className='flex space-x-4'>
        <button
          onClick={handleUndo}
          className='bg-blue-500 text-white py-2 px-4 rounded'
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className='bg-blue-500 text-white py-2 px-4 rounded'
        >
          Redo
        </button>
      </div>

      {/* Fixed Text Area (Canvas) */}
      <div
        className='border-2 border-green-500 w-80 h-80 relative'
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Draggable Input Field inside the canvas */}
        <input
          type='text'
          value={text}
          onChange={handleTextChange} // Update text as the user types
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
        />
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

        <button
          onClick={addNewText}
          className='bg-green-500 text-white py-2 px-4 rounded w-full'
        >
          Add Text
        </button>
      </div>
    </div>
  );
};
