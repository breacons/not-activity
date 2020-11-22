import React from 'react';
import { Player, Team } from '../../../types/player';
import styles from '../LobbyPage.module.sass';
import If from '../../../components/If';

export interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const name = <span>{player.name}</span>;
  const emoji = <span className={styles.labelEmoji}>{player.emoji}</span>;
  return (
    <div className={player.team === Team.RED ? styles.playerCardRed : styles.playerCardBlue}>
      <If
        condition={player.team === Team.BLUE}
        then={() => (
          <>
            <span>
              {emoji} {name}
            </span>{' '}
            <If
              condition={!!player.score}
              then={() => <span className={styles.playerScoreBlue}>{player.score}</span>}
            />
          </>
        )}
        else={() => (
          <>
            <If
              condition={!!player.score}
              then={() => <span className={styles.playerScoreRed}>{player.score}</span>}
              else={() => <span />}
            />{' '}
            <span>
              {name} {emoji}
            </span>
          </>
        )}
      />
    </div>
  );
};

export default PlayerCard;
