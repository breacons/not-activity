import React from 'react';

import styles from './EmojiCard.module.sass';

interface EmojiCardProps {
  emoji: string;
  onClick: (emoji: string) => void;
  isSelected: boolean;
}

export const EmojiCard = ({ emoji, onClick, isSelected }: EmojiCardProps) => {
  return (
    <div className="cardWrapper">
      <div className={`card ${isSelected ? 'selected' : ''}`} onClick={() => onClick(emoji)}>
        {emoji}
      </div>
    </div>
  );
};

export default EmojiCard;
