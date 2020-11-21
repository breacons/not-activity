import React, { useContext } from 'react';
import { Round } from '../../../../types/game';
import { Player } from '../../../../types/player';
import PresentInRound from './PresentInRound/PresentInRound';
import GuessInRound from './GuessInRound';
import WaitInRound from './WaitInRound';
import { useParams } from 'react-router';
import { StreamContext } from '../../../../App';

interface RoundContainerProps {
  // round: Round;
  // me: Player;
  // setStream: (stream: MediaStream) => void;
  a?: null
}

export const RoundContainer = ({}: RoundContainerProps) => {
  const { gameId } = useParams<{ gameId: string }>();
  const { round, me, setMyStream } = useContext(StreamContext);

  if (!round) {
    return <span>Loading: round is null</span>;
  }

  const activePlayer = round.activePlayer;

  if (gameId === '000') {
    return <WaitInRound  />;
  }

  if (me.id === activePlayer.id) {
    return <PresentInRound />;
  }

  if (me.team === activePlayer.team) {
    return <GuessInRound />;
  }

  return <WaitInRound />;
};

export default RoundContainer;
