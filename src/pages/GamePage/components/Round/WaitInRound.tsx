import React from 'react';
import { Round } from '../../../../types/game';
import { Player } from '../../../../types/player';

interface WaitInRoundProps {
    round: Round;
    me: Player;
}

export const WaitInRound = ({ round }: WaitInRoundProps) => {
    return <div>Wait in round</div>;
};

export default WaitInRound;
