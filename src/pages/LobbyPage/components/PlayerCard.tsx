import React from 'react';
import { Player, Team } from '../../../types/player';
import styles from '../LobbyPage.module.sass';

export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className={player.team === Team.RED ? styles.playerCardRed : styles.playerCardBlue}>
      <span className={styles.labelEmoji}>{player.emoji}</span>
      {player.name} {!!player.score && ` - ${player.score}`}
    </div>
  );
};

export default PlayerCard;
