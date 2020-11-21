import React from 'react';
import { Round } from '../../../../types/game';
import { Player } from '../../../../types/player';

interface GuessInRoundProps {
  round: Round;
  me: Player;
}

export const GuessInRound = ({ round }: GuessInRoundProps) => {
  return <div>Guess in round</div>;
};

export default GuessInRound;
