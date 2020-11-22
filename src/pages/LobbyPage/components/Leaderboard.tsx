import React from 'react';
import { Leaderboard } from '../../../types/game';
import { Team } from '../../../types/player';
import PlayerCard from './PlayerCard';

import styles from '../LobbyPage.module.sass';

export const LeaderboardComponent = (props: { leaderboard: Leaderboard }) => {
  const { leaderboard } = props;
  return (
    <div className={styles.players}>
      <div className={styles.playersColumn}>
        <h3 className={styles.teamTitleBlue}>
          🔵&nbsp;&nbsp;Blue Team{' '}
          {!!leaderboard.teamScores[Team.BLUE] && (
            <span className={styles.score}>{leaderboard.teamScores[Team.BLUE]}</span>
          )}
        </h3>
        {leaderboard.playerLeaderboard
          .filter((p) => p.team === Team.BLUE)
          .map((player) => (
            <PlayerCard player={player} key={player.id} />
          ))}
      </div>
      <div className={styles.playersColumn}>
        <h3 className={styles.teamTitleRed}>
          {!!leaderboard.teamScores[Team.RED] && (
            <span className={styles.score}>{leaderboard.teamScores[Team.RED]}</span>
          )}{' '}
          Red Team&nbsp;&nbsp;🔴
        </h3>

        {leaderboard.playerLeaderboard
          .filter((p) => p.team === Team.RED)
          .map((player) => (
            <PlayerCard player={player} key={player.id} />
          ))}
      </div>
    </div>
  );
};
