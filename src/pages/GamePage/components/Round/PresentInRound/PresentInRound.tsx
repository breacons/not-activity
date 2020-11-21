import React, { useContext } from 'react';
import { Round, RoundType } from '../../../../../types/game';
import { Player } from '../../../../../types/player';
import DrawPresent from './DrawPresent';
import TalkPresent from './TalkPresent';
import ShowPresent from './ShowPresent';
import { StreamContext } from '../../../../../App';

interface PresentInRoundProps {
  // round: Round;
  // me: Player;
  // setStream: (stream: MediaStream) => void;
  a?: null;
}

export const PresentInRound = ({}: PresentInRoundProps) => {
  const { round, setMyStream } = useContext(StreamContext);

  if (!round) {
    return <div>Waiting for round</div>;
  }

  if (round.roundType === RoundType.draw) {
    return <DrawPresent round={round} setStream={setMyStream} />;
  }

  if (round.roundType === RoundType.show) {
    return <ShowPresent />;
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
