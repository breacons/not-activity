import React, { Fragment, useContext } from 'react';
import { Round, RoundType } from '../../../../../types/game';
import { Player } from '../../../../../types/player';
import DrawPresent from './DrawPresent';
import TalkPresent from './TalkPresent';
import ShowPresent from './ShowPresent';
import { StreamContext } from '../../../../../App';

interface PresentInRoundProps {}

export const PresentInRound = ({}: PresentInRoundProps) => {
  const { round } = useContext(StreamContext);

  if (!round) {
    return <div>Waiting for round</div>;
  }

  const getPresentByType = () => {
    if (round.roundType === RoundType.draw) {
      return <DrawPresent />;
    }

    if (round.roundType === RoundType.show) {
      return <ShowPresent />;
    }

    if (round.roundType === RoundType.talk) {
      return <TalkPresent />;
    }
  };

  return (
    <div>
      <h1>Presenting</h1>
      {getPresentByType()}
    </div>
  );
};

export default PresentInRound;
