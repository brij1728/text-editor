'use client';

import React, { useRef, useState } from 'react';

import { TextArea } from '../TextArea';
import { TextStyles } from '../TextStyles';
import { UndoRedo } from '../UndoRedo';

interface TextStyle {
  fontSize: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
}

export const TextEditor = () => {
  const [text, setText] = useState<string>('Abhinav');
  const [style, setStyle] = useState<TextStyle>({
    fontSize: '20px',
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
  });
  const [editing, setEditing] = useState<boolean>(false);

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

  const textAreaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const updateHistory = (newText: string, newStyle: TextStyle) => {
    const newHistory = [
      ...history.slice(0, currentIndex + 1),
      { text: newText, style: newStyle },
    ];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

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

      const minX = 0;
      const minY = 0;
      const maxX = textAreaRect.width - textRect.width;
      const maxY = textAreaRect.height - textRect.height;

      const boundedX = Math.max(minX, Math.min(newX, maxX));
      const boundedY = Math.max(minY, Math.min(newY, maxY));

      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const addNewText = () => {
    setText('New Text');
    setEditing(true);
    updateHistory('New Text', style);
    textRef.current?.focus();
  };

  const handleTextClick = () => {
    setEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    updateHistory(text, style);
  };

  return (
    <div className='flex flex-col items-center justify-center space-y-8 p-8 w-full max-w-3xl mx-auto'>
      <h1 className='text-3xl font-bold'>Text Editor</h1>
      <UndoRedo
        history={history}
        setText={setText}
        setStyle={setStyle}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <TextArea
        text={text}
        style={style}
        position={position}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        textAreaRef={textAreaRef}
        textRef={textRef}
        editing={editing}
        handleTextChange={handleTextChange}
        handleTextClick={handleTextClick}
        handleBlur={handleBlur}
      />
      <TextStyles
        style={style}
        setStyle={setStyle}
        updateHistory={updateHistory}
        text={text}
      />
      <button
        className='bg-green-500 text-white py-2 px-4 rounded w-full max-w-3xl mx-auto'
        onClick={addNewText}
      >
        Add New Text
      </button>
    </div>
  );
};
