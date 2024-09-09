import React from 'react';

interface TextAreaProps {
  text: string;
  style: {
    fontSize: string;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
  };
  position: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  textAreaRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
}

export const TextArea: React.FC<TextAreaProps> = ({
  text,
  style,
  position,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  textAreaRef,
  textRef,
}) => {
  return (
    <div
      className='border-2 border-green-500 w-80 h-80 relative'
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={textAreaRef}
    >
      <div
        className='absolute text-center bg-transparent border-none outline-none'
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          cursor: 'grab', // Visual feedback for dragging
        }}
        onMouseDown={handleMouseDown}
        ref={textRef}
      >
        {text}
      </div>
    </div>
  );
};
