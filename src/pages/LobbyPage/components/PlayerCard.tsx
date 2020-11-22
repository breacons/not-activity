import React from 'react';
import { Player, Team } from '../../../types/player';
import styles from '../LobbyPage.module.sass';
import If from '../../../components/If';

export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const name = (
    <span>
      {player.name} {!!player.score && `- ${player.score}`}
    </span>
  );
  const emoji = <span className={styles.labelEmoji}>{player.emoji}</span>;
  return (
    <div className={player.team === Team.RED ? styles.playerCardRed : styles.playerCardBlue}>
      <If
        condition={player.team === Team.BLUE}
        then={() => (
          <>
            {emoji} {name} {!!player.score && ` - ${player.score}`}
          </>
        )}
        else={() => (
          <>
            {!!player.score && `${player.score} - `} {name} {emoji}
          </>
        )}
      />
    </div>
  );
};

export default PlayerCard;
