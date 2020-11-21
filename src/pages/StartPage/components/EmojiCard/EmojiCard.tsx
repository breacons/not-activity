import React from 'react';

import styles from './EmojiCard.module.sass';

interface EmojiCardProps {
  emoji: string;
  onClick: (emoji: string) => void;
}

export const EmojiCard = ({ emoji, onClick }: EmojiCardProps) => {
  return (
    <div className={styles.card} onClick={() => onClick(emoji)}>
      {emoji}
    </div>
  );
};

export default EmojiCard;
