import React from 'react';

// Define a more precise type for the style object
interface TextStyle {
  fontSize: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
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
    const newStyle = { ...style };

    if (name === 'fontWeight') {
      newStyle.fontWeight = value as 'normal' | 'bold';
    } else if (name === 'fontStyle') {
      newStyle.fontStyle = value as 'normal' | 'italic';
    } else if (name === 'fontSize') {
      newStyle.fontSize = `${value}px`;
    } else if (name === 'fontFamily') {
      newStyle.fontFamily = value;
    }

    setStyle(newStyle);
    updateHistory(text, newStyle);
  };

  return (
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
  );
};
