import React from 'react';
import { Round } from '../../../../../types/game';

interface TalkPresentProps {
  round: Round;
}

export const TalkPresent = ({ round }: TalkPresentProps) => {
  return <div>TalkPresent in round</div>;
};

export default TalkPresent;
