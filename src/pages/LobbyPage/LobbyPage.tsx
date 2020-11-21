import React, { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Player, TEAM } from '../../types/player';
import PlayerCard from './components/PlayerCard';
import { getGameUrl } from '../../url';
import If from '../../components/If';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LobbyPageProps {}

export const defaultPlayers = [
  {
    id: '1234',
    name: 'Greg',
    emoji: '🙄',
    team: TEAM.BLUE,
  },
  {
    id: '4829',
    name: 'Maró',
    emoji: '🤓',
    team: TEAM.RED,
  },
  {
    id: '4820',
    name: 'Dános',
    emoji: '🍆',
    team: TEAM.BLUE,
  },
];

export const LobbyPage = ({}: LobbyPageProps) => {
  const { gameId } = useParams<{ gameId: string }>();
  const [players, setPlayers] = useState<Player[]>(defaultPlayers);
  const history = useHistory();

  useEffect(() => {
    // TODO: socket

    const timer = setTimeout(() => {
      setPlayers([
        ...players,
        {
          id: '59200',
          name: 'Laki',
          emoji: '💰',
          team: TEAM.RED,
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      <h2>Game: {gameId}</h2>
      {players.map((player) => (
        <PlayerCard player={player} key={player.id} />
      ))}
      <If
        condition={players.length < 4}
        then={() => <span>At least 4 player is needed</span>}
        else={() => <button onClick={() => history.push(getGameUrl(gameId))}>Start Game</button>}
      />
    </Fragment>
  );
};

export default LobbyPage;
