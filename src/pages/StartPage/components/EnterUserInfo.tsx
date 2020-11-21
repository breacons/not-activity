import React, { Fragment } from 'react';
import { Player } from '../../../types/player';

interface EnterPlayerInfoProps {
  updatePlayer: (name: string) => void;
}
export const EnterPlayerInfo = ({ updatePlayer }: EnterPlayerInfoProps) => {
  return (
    <Fragment>
      <label>What is your name?</label>
      <input onChange={(event) => updatePlayer(event.target.value)} id="name" />
      {/* <br />
      <label>What's your favourite emoji?</label>
      <input onChange={(event) => updatePlayer({ emoji: event.target.value })} id="emoji" /> */}
    </Fragment>
  );
};

export default EnterPlayerInfo;
