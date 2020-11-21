import React, { Fragment, useEffect, useState } from 'react';
import { Player } from '../../../types/player';
import { getRandomEmoji } from '../../../util/random-emoji';
import EmojiCard from './EmojiCard/EmojiCard';

interface EnterPlayerInfoProps {
  updatePlayer: (updatedPlayer: Partial<Player>) => void;
}

export const EnterPlayerInfo = ({ updatePlayer }: EnterPlayerInfoProps) => {
  const [emojis, setEmojis] = useState<string[]>([]);

  useEffect(() => {
    setEmojis(Array.from(Array(10).keys()).map(() => getRandomEmoji()));
  }, []);

  return (
    <Fragment>
      <label>What is your name?</label>
      <input onChange={(event) => updatePlayer({ name: event.target.value })} id="name" />
      <br />
      <label>What&apos; spirit emoji?</label>
      {emojis.map((emoji) => (
        <EmojiCard emoji={emoji} onClick={(emoji) => updatePlayer({ emoji })} />
      ))}
      <input onChange={(event) => updatePlayer({ emoji: event.target.value })} id="emoji" />
    </Fragment>
  );
};

export default EnterPlayerInfo;
