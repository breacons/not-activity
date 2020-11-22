import React from 'react';

import styles from './EmojiCard.module.sass';

interface EmojiCardProps {
  emoji: string;
  onClick: (emoji: string) => void;
  selectedEmoji: string;
}

export const EmojiCard = ({ emoji, onClick, selectedEmoji }: EmojiCardProps) => {
  return (
    <div className={styles.card} onClick={() => onClick(emoji)}>
      {emoji}
      {selectedEmoji == emoji && 'x'}
    </div>
  );
};

export default EmojiCard;
