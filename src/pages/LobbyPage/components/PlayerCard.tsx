import React from 'react';
import { Player, TEAM } from '../../../types/player';

export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div style={{ color: 'white',  width: 100, height: 100, backgroundColor: player.team === TEAM.RED ? 'red' : 'blue' }}>
      {player.emoji}
      <br />
      {player.name}
    </div>
  );
};

export default PlayerCard;
