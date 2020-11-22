import React from 'react';
import { Leaderboard } from '../../../types/game';
import { Team } from '../../../types/player';
import PlayerCard from './PlayerCard';

export const LeaderboardComponent = (props: { leaderboard: Leaderboard }) => {
  const { leaderboard } = props;
  return (
    <div className="players">
      <div className="playersColumn">
        <h3 className="teamTitle">
          <span className="blue">Blue</span> Team{' '}
          {!!leaderboard.teamScores[Team.BLUE] && <span className="score">{leaderboard.teamScores[Team.BLUE]}</span>}
        </h3>
        {leaderboard.playerLeaderboard
          .filter((p) => p.team === Team.BLUE)
          .map((player) => (
            <PlayerCard player={player} key={player.id} />
          ))}
      </div>
      <div className="playersColumn">
        <h3 className="teamTitle">
          <span className="red">Red</span> Team{' '}
          {!!leaderboard.teamScores[Team.RED] && <span className="score">{leaderboard.teamScores[Team.RED]}</span>}
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
