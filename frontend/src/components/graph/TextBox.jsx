import React, { useState } from 'react';
import Draggable from 'react-draggable';
import classes from './TextBox.module.css'

const TextBox = ({ id, text, onClick, type }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = () => {
    setIsDragging(true);
  }

  const handleStop = () => {
    setIsDragging(false);
  }

  const handleClick = () => {
    if (!isDragging) {
      onClick(id);
    }
  }

  return (
    <Draggable
      onStart={handleStart}
      onStop={handleStop}
    >
      <div
        className={
          type === 'query' ? classes.query : type === 'response' ? classes.response : type === 'system' ? classes.textbox : classes.textbox
        }
        onClick={handleClick}
      >
        {text}
      </div>
    </Draggable>
  );
};

export default TextBox;
