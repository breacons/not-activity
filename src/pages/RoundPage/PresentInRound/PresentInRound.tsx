import React, { useContext } from 'react';
import { RoundType } from '../../../types/game';
import DrawPresent from './DrawPresent';
import TalkPresent from './TalkPresent';
import ShowPresent from './ShowPresent';
import { StreamContext } from '../../../App';

export const PresentInRound = () => {
  const { round } = useContext(StreamContext);

  if (!round) {
    return <div>Loading...</div>;
  }

  if (round.roundType === RoundType.draw) {
    return <DrawPresent />;
  }

  if (round.roundType === RoundType.show) {
    return <ShowPresent />;
  }

  return <TalkPresent />;
};

export default PresentInRound;
