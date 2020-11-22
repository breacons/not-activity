import React from 'react';
import { Player } from '../../../types/player';
import '../LobbyPage.css';
export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className={`playerCard ${player.team?.toLowerCase()}`}>
      <span className="labelEmoji">{player.emoji}</span>
      {player.name} {!!player.score && ` - ${player.score}`}
    </div>
  );
};

export default PlayerCard;
