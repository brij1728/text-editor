'use client';

import React, { useState } from 'react';

export const TextEditor = () => {
  // State for managing the text
  const [text, setText] = useState('Abhinav');
  const [history, setHistory] = useState([text]);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [style, setStyle] = useState({
    fontSize: '20px',
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
  });
  const [historyPointer, setHistoryPointer] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Undo/Redo Functions
  const handleUndo = () => {
    if (historyPointer > 0) {
      setHistoryPointer(historyPointer - 1);
      setText(history[historyPointer - 1]);
    }
  };

  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(historyPointer + 1);
      setText(history[historyPointer + 1]);
    }
  };

  // Text Change handler
  const handleTextChange = (newText: string) => {
    const newHistory = [...history.slice(0, historyPointer + 1), newText];
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
    setText(newText);
  };

  // Font Size, Font Family, and Style Change handlers
  const handleStyleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'fontSize') {
      setStyle({
        ...style,
        fontSize: `${value}px`,
      });
    } else {
      setStyle({
        ...style,
        [name]: value,
      });
    }
  };

  // Add new text functionality
  const addNewText = () => {
    handleTextChange('New Text');
  };

  // Mouse event handlers for drag and drop
  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - 50,
        y: e.clientY - 50,
      });
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

      {/* Text Area (Canvas) */}
      <div
        className='border-2 border-green-500 w-80 h-80 relative flex items-center justify-center'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          fontSize: style.fontSize, // Font size applied correctly with px
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
        }}
      >
        <input
          type='text'
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          className='text-center'
          style={style} // Apply the style object to the input
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
            value={parseInt(style.fontSize, 10)} // Parse the px value back to an integer
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
