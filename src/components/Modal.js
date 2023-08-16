import React, { useEffect, useCallback } from 'react';

const Modal = ({ largeImageURL, onClose }) => {
  const handleKeyPress = useCallback(
    e => {
      if (e.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const keyPressHandler = e => {
      handleKeyPress(e);
    };

    window.addEventListener('keydown', keyPressHandler);
    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, [handleKeyPress]);

  return (
    <div className="Overlay" onClick={onClose}>
      <div className="Modal">
        <img src={largeImageURL} alt="" />
      </div>
    </div>
  );
};

export default Modal;
