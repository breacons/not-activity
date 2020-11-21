import React from 'react';
import { Round, RoundType } from '../../../../../types/game';
import { Player } from '../../../../../types/player';
import DrawPresent from './DrawPresent';
import TalkPresent from './TalkPresent';
import ShowPresent from './ShowPresent';

interface PresentInRoundProps {
  round: Round;
  me: Player;
  setStream: (stream: MediaStream) => void;
}

export const PresentInRound = ({ round, setStream }: PresentInRoundProps) => {
  if (round.roundType === RoundType.draw) {
    return <DrawPresent round={round} setStream={setStream} />;
  }

  if (round.roundType === RoundType.show) {
    return <ShowPresent round={round} />;
  }

  if (round.roundType === RoundType.talk) {
    return <TalkPresent round={round} />;
  }
  return (
    <div>
      Your job is to {round.roundType}: {round.answer}
    </div>
  );
};

export default PresentInRound;
