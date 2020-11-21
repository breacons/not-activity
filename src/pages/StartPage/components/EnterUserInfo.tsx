import React, { Fragment } from 'react';
import { Player } from '../../../types/player';

interface EnterPlayerInfoProps {
  updatePlayer: (player: Partial<Player>) => void;
}
export const EnterPlayerInfo = ({ updatePlayer }: EnterPlayerInfoProps) => {
  return (
    <Fragment>
      <label>What's your name?</label>
      <input onChange={(event) => updatePlayer({ name: event.target.value })} id="name" />
      <br />
      <label>What's your favourite emoji?</label>
      <input onChange={(event) => updatePlayer({ emoji: event.target.value })} id="emoji" />
    </Fragment>
  );
};

export default EnterPlayerInfo;
