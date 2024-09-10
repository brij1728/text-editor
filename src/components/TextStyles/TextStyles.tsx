import { BsTypeBold, BsTypeItalic, BsTypeUnderline } from 'react-icons/bs'; // Icons for Bold, Italic, Underline
import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi'; // Icons for Plus and Minus

import React from 'react';

interface TextStyle {
  fontSize: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
}

interface ControlsProps {
  style: TextStyle;
  setStyle: React.Dispatch<React.SetStateAction<TextStyle>>;
  updateHistory: (newText: string, newStyle: TextStyle) => void;
  text: string;
}

export const TextStyles: React.FC<ControlsProps> = ({
  style,
  setStyle,
  updateHistory,
  text,
}) => {
  const handleStyleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const newStyle = { ...style, [name]: value };
    setStyle(newStyle);
    updateHistory(text, newStyle);
  };

  const handleFontSizeChange = (increment: boolean) => {
    const newSize = parseInt(style.fontSize, 10) + (increment ? 1 : -1);
    const newStyle = { ...style, fontSize: `${newSize}px` };
    setStyle(newStyle);
    updateHistory(text, newStyle);
  };

  const handleButtonClick = (property: keyof TextStyle, value: string) => {
    const newStyle = { ...style, [property]: value };
    setStyle(newStyle);
    updateHistory(text, newStyle);
  };

  return (
    <div className='flex flex-col md:flex-row w-full p-4 bg-slate-50 border border-gray-300 rounded-md gap-4 text-sm md:text-xl'>
      {/* Font Family Selector */}
      <div className='flex w-full md:w-2/5 flex-wrap items-center justify-center space-x-4'>
        <select
          name='fontFamily'
          value={style.fontFamily}
          onChange={handleStyleChange}
          className='p-2 border border-gray-300 rounded-md w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='Arial'>Arial</option>
          <option value='Georgia'>Georgia</option>
          <option value='Courier New'>Courier New</option>
        </select>
      </div>

      {/* Font Size Controls */}
      <div className='flex w-full  items-center justify-between gap-2 md:gap-4'>
        <div className='flex items-center justify-center space-x-2 p-1 md:p-2 bg-white rounded-lg border border-gray-300 shadow-md'>
          <button
            onClick={() => handleFontSizeChange(false)}
            className='p-1 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-md'
          >
            <HiOutlineMinus />
          </button>
          <input
            type='number'
            name='fontSize'
            value={parseInt(style.fontSize, 10)}
            onChange={handleStyleChange}
            className='w-12 md:w-16 mx-auto  text-center  focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={() => handleFontSizeChange(true)}
            className='p-1 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-md'
          >
            <HiOutlinePlus />
          </button>
        </div>

        {/* Text Styles: Bold, Italic, Underline */}
        <div className='flex items-center  p-1 md:p-2 bg-white rounded-lg border border-gray-300 shadow-md gap-1 md:gap-2'>
          <button
            onClick={() =>
              handleButtonClick(
                'fontWeight',
                style.fontWeight === 'bold' ? 'normal' : 'bold',
              )
            }
            className={`p-1 md:p-2 ${style.fontWeight === 'bold' ? 'bg-gray-300' : 'bg-gray-100'} hover:bg-gray-200 rounded-md`}
          >
            <BsTypeBold />
          </button>
          <button
            onClick={() =>
              handleButtonClick(
                'fontStyle',
                style.fontStyle === 'italic' ? 'normal' : 'italic',
              )
            }
            className={`p-1 md:p-2 ${style.fontStyle === 'italic' ? 'bg-gray-300' : 'bg-gray-100'} hover:bg-gray-200 rounded-md`}
          >
            <BsTypeItalic />
          </button>
          <button
            onClick={() =>
              handleButtonClick(
                'textDecoration',
                style.textDecoration === 'underline' ? 'none' : 'underline',
              )
            }
            className={`p-1 md:p-2 ${style.textDecoration === 'underline' ? 'bg-gray-300' : 'bg-gray-100'} hover:bg-gray-200 rounded-md`}
          >
            <BsTypeUnderline />
          </button>
        </div>
      </div>
    </div>
  );
};
