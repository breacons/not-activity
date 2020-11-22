import React from 'react';
import { Player, TEAM } from '../../../types/player';

export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className={`playerCard ${player.team?.toLowerCase()}`}>
      <span className="labelEmoji">{player.emoji}</span>
      {player.name}
    </div>
  );
};

export default PlayerCard;
