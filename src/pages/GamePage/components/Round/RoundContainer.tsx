import React from 'react';
import { Round } from '../../../../types/game';
import { Player } from '../../../../types/player';
import PresentInRound from './PresentInRound/PresentInRound';
import GuessInRound from './GuessInRound';
import WaitInRound from './WaitInRound';

interface RoundContainerProps {
  round: Round;
  me: Player;
  setStream: (stream: MediaStream) => void;
}

export const RoundContainer = ({ round, me, setStream }: RoundContainerProps) => {
  const activePlayer = round.activePlayer;

  if (me.id === activePlayer.id) {
    return <PresentInRound round={round} me={me} setStream={setStream} />;
  }

  if (me.team === activePlayer.team) {
    return <GuessInRound round={round} me={me} />;
  }

  return <WaitInRound round={round} me={me} />;
};

export default RoundContainer;
