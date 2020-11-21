import React from 'react';
import { Round } from '../../../../../types/game';
import { Player } from '../../../../../types/player';

interface ShowPresentProps {
  round: Round;
}

export const ShowPresent = ({ round }: ShowPresentProps) => {
  return <div>ShowPresent in round</div>;
};

export default ShowPresent;
