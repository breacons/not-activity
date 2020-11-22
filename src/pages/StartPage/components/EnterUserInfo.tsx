import React, { Fragment, useEffect, useState } from 'react';
import { Player } from '../../../types/player';
import { getRandomEmoji } from '../../../util/random-emoji';
import EmojiCard from './EmojiCard/EmojiCard';

import styles from './EnterUserInfo.module.sass';

interface EnterPlayerInfoProps {
  updatePlayer: (updatedPlayer: Partial<Player>) => void;
  player: Partial<Player>;
}

export const EnterPlayerInfo = ({ updatePlayer, player }: EnterPlayerInfoProps) => {
  const [emojis, setEmojis] = useState<string[]>([]);

  useEffect(() => {
    setEmojis(Array.from(Array(8).keys()).map(() => getRandomEmoji()));
  }, []);

  return (
    <Fragment>
      <label className={styles.userNameLabel}>What is your name?</label>
      <div className={styles.inputWrapper}>
        <input
          autoFocus={true}
          autoCorrect="off"
          autoComplete="off"
          className={styles.userNameInput}
          onChange={(event) => updatePlayer({ name: event.target.value })}
          id="name"
          placeholder={'Awesome Joe'}
        />
      </div>
      <br />
      <label className={styles.userNameLabel}>What's your spirit emoji?</label>
      <div className={styles.cards}>
        {emojis.map((emoji) => (
          <EmojiCard
            key={emoji}
            emoji={emoji}
            onClick={(emoji) => updatePlayer({ emoji })}
            isSelected={player.emoji === emoji}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default EnterPlayerInfo;
