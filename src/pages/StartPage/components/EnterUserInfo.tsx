import React, { Fragment, useEffect, useState } from 'react';
import { Player } from '../../../types/player';
import { getRandomEmoji } from '../../../util/random-emoji';
import EmojiCard from './EmojiCard/EmojiCard';

interface EnterPlayerInfoProps {
  updatePlayer: (updatedPlayer: Partial<Player>) => void;
  player: Partial<Player>;
}

export const EnterPlayerInfo = ({ updatePlayer, player }: EnterPlayerInfoProps) => {
  const [emojis, setEmojis] = useState<string[]>([]);

  useEffect(() => {
    setEmojis(Array.from(Array(9).keys()).map(() => getRandomEmoji()));
  }, []);

  return (
    <Fragment>
      <label className="userNameLabel">What is your name?</label>
      <div className="inputWrapper">
        <input className="userNameInput" onChange={(event) => updatePlayer({ name: event.target.value })} id="name" />
      </div>
      <br />
      <label className="userNameLabel">What is your spirit emoji?</label>
      <div className="cards">
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
