import React from 'react';

import styles from './EmojiCard.module.sass';

interface EmojiCardProps {
  emoji: string;
  onClick: (emoji: string) => void;
  isSelected: boolean;
}

export const EmojiCard = ({ emoji, onClick, isSelected }: EmojiCardProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={isSelected ? styles.cardSelected : styles.card} onClick={() => onClick(emoji)}>
        {emoji}
      </div>
    </div>
  );
};

export default EmojiCard;
