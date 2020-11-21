import React, { useContext } from 'react';
import PresentInRound from './PresentInRound/PresentInRound';
import WaitInRound from './WaitInRound/WaitInRound';
import { StreamContext } from '../../App';

export const RoundContainer = () => {
  const { round, me } = useContext(StreamContext);

  if (!round) {
    return <span>Loading...</span>;
  }

  const activePlayer = round.activePlayer;

  if (me?.id === activePlayer.id) {
    return <PresentInRound />;
  }

  return <WaitInRound />;
};

export default RoundContainer;
